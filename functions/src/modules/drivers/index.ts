import * as admin from "firebase-admin";
import { db } from "../../config";

export interface SubmitDriverApplicationParams {
  userId: string;
  fullName: string;
  phone: string;
  email?: string;
  serviceAreas?: string[];
  vehicleType: string;
  registrationNumber: string;
  capacityKg: number;
  vehiclePhotos?: string[];
  documents?: {
    drivingLicenseUrl?: string;
    rcBookUrl?: string;
    insuranceUrl?: string;
    aadharUrl?: string;
  };
}

export async function submitDriverApplicationInternal(params: SubmitDriverApplicationParams) {
  const {
    userId,
    fullName,
    phone,
    email,
    serviceAreas,
    vehicleType,
    registrationNumber,
    capacityKg,
    vehiclePhotos = [],
    documents = {},
  } = params;

  const now = admin.firestore.FieldValue.serverTimestamp();

  // 1. Create or update driver profile
  const driverRef = db.collection("driverProfiles").doc(userId);
  await driverRef.set(
    {
      userId,
      fullName,
      phone,
      email: email || "",
      verificationStatus: "pending",
      onlineStatus: false,
      serviceAreas: serviceAreas || ["Gandhipuram", "RS Puram", "Peelamedu", "SIDCO"],
      rating: 5.0,
      totalTrips: 0,
      documents,
      createdAt: now,
      updatedAt: now,
    },
    { merge: true }
  );

  // 2. Create vehicle entry in `vehicles/{vehicleId}`
  const vehicleRef = db.collection("vehicles").doc();
  await vehicleRef.set({
    id: vehicleRef.id,
    driverId: userId,
    vehicleType,
    registrationNumber,
    capacityKg,
    vehiclePhotos,
    verificationStatus: "pending",
    isActive: true,
    createdAt: now,
    updatedAt: now,
  });

  // 3. Update user profile verification status
  await db.collection("users").doc(userId).set(
    {
      driverVerificationStatus: "pending",
      updatedAt: now,
    },
    { merge: true }
  );

  return {
    success: true,
    userId,
    vehicleId: vehicleRef.id,
    verificationStatus: "pending",
  };
}

export interface ApproveDriverParams {
  driverId: string;
  vehicleId?: string;
  approved: boolean;
  rejectionReason?: string;
}

export async function approveDriverInternal(params: ApproveDriverParams) {
  const { driverId, vehicleId, approved, rejectionReason } = params;
  const status = approved ? "approved" : "rejected";
  const now = admin.firestore.FieldValue.serverTimestamp();

  const driverRef = db.collection("driverProfiles").doc(driverId);
  const userRef = db.collection("users").doc(driverId);

  await db.runTransaction(async (transaction) => {
    // 1. Update driver profile
    transaction.set(
      driverRef,
      {
        verificationStatus: status,
        rejectionReason: approved ? null : rejectionReason || "Documents unverified",
        updatedAt: now,
      },
      { merge: true }
    );

    // 2. Update user document and grant 'driver' role if approved
    const userSnap = await transaction.get(userRef);
    if (userSnap.exists) {
      const userData = userSnap.data();
      const currentRoles: string[] = userData?.roles || ["customer"];
      const newRoles = approved
        ? Array.from(new Set([...currentRoles, "driver"]))
        : currentRoles;

      transaction.update(userRef, {
        roles: newRoles,
        driverVerificationStatus: status,
        updatedAt: now,
      });
    }

    // 3. Update vehicle status if provided
    if (vehicleId) {
      const vehicleRef = db.collection("vehicles").doc(vehicleId);
      transaction.set(
        vehicleRef,
        {
          verificationStatus: status,
          updatedAt: now,
        },
        { merge: true }
      );
    }

    // 4. Send notification to driver
    const notifRef = db.collection("notifications").doc();
    transaction.set(notifRef, {
      userId: driverId,
      title: approved ? "Account Approved! 🚚" : "Application Update",
      body: approved
        ? "Congratulations! Your partner account is approved. Turn on Online status to start accepting loads in Coimbatore."
        : `Your application was not approved: ${rejectionReason || "Please verify your documents."}`,
      read: false,
      type: "system",
      createdAt: now,
    });
  });

  return { success: true, driverId, status };
}

export interface ReviewOnboardingParams {
  adminUid: string;
  driverId: string;
  decision: "APPROVED" | "REJECTED" | "NEEDS_CORRECTION";
  remarks: string;
  correctionSection?: string;
  correctionDocument?: string;
}

export async function reviewDriverOnboardingInternal(params: ReviewOnboardingParams) {
  const { adminUid, driverId, decision, remarks, correctionSection, correctionDocument } = params;
  const now = admin.firestore.FieldValue.serverTimestamp();

  const appRef = db.collection("driverApplications").doc(driverId);
  const userRef = db.collection("users").doc(driverId);
  const auditRef = db.collection("adminAuditLogs").doc();

  await db.runTransaction(async (t) => {
    const appSnap = await t.get(appRef);
    const prevStatus = appSnap.exists ? appSnap.data()?.status : "SUBMITTED";

    const updatePayload: Record<string, any> = {
      status: decision,
      adminRemarks: remarks,
      updatedAt: now,
      lastUpdatedDate: new Date().toISOString(),
    };

    if (decision === "APPROVED") {
      updatePayload.driverApproval = "verified";
      updatePayload.vehicleApproval = "verified";
      updatePayload.bankVerification = "verified";
      t.update(userRef, {
        roles: admin.firestore.FieldValue.arrayUnion("driver"),
        driverVerificationStatus: "approved",
        updatedAt: now,
      });
    } else if (decision === "REJECTED") {
      updatePayload.driverApproval = "rejected";
      t.update(userRef, {
        driverVerificationStatus: "rejected",
        updatedAt: now,
      });
    } else if (decision === "NEEDS_CORRECTION") {
      updatePayload.driverApproval = "needs_correction";
      if (correctionSection && correctionDocument) {
        updatePayload.correctionItems = admin.firestore.FieldValue.arrayUnion({
          id: `CORR-${Date.now()}`,
          section: correctionSection,
          documentType: correctionDocument,
          rejectionReason: remarks,
          requiredAction: `Please upload a clear, valid copy of ${correctionDocument}.`,
          submittedAt: new Date().toISOString(),
          resolved: false,
        });
      }
      t.update(userRef, {
        driverVerificationStatus: "pending",
        updatedAt: now,
      });
    }

    t.set(appRef, updatePayload, { merge: true });

    // Audit log
    t.set(auditRef, {
      id: auditRef.id,
      adminUid,
      driverUid: driverId,
      action: decision === "APPROVED" ? "APPROVE_DRIVER" : decision === "REJECTED" ? "REJECT_DRIVER" : "REQUEST_CORRECTION",
      previousStatus: prevStatus,
      newStatus: decision,
      reason: remarks,
      timestamp: new Date().toISOString(),
    });

    // Notify Driver
    const notif = db.collection("notifications").doc();
    t.set(notif, {
      userId: driverId,
      title: decision === "APPROVED" ? "Driver Account Approved! 🚚" : decision === "NEEDS_CORRECTION" ? "Action Needed: Document Correction" : "Application Update",
      body: remarks,
      read: false,
      type: "system",
      createdAt: now,
    });
  });

  return { success: true, driverId, decision };
}
