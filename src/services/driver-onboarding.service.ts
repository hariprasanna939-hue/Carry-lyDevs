import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import {
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { auth, db, storage } from "../firebase/firebase";
import {
  AdminAuditLog,
  ApprovalLevelStatus,
  DriverApplicationRecord,
  DriverApplicationStatus,
  RegisteredVehicle,
} from "../types/driver-onboarding";

const DRAFT_STORAGE_KEY_PREFIX = "@carry_driver_draft_";

export const driverOnboardingService = {
  getDraftKey(uid: string): string {
    return `${DRAFT_STORAGE_KEY_PREFIX}${uid}`;
  },

  /**
   * Save draft progress locally and optionally sync with Firestore
   */
  async saveDraftProgress(
    uid: string,
    partialData: Partial<DriverApplicationRecord>
  ): Promise<DriverApplicationRecord> {
    try {
      const existing = await this.getDriverApplication(uid);
      const updated: DriverApplicationRecord = {
        ...existing,
        ...partialData,
        lastUpdatedDate: new Date().toISOString(),
      };

      // 1. Cache to AsyncStorage for immediate resilience
      await AsyncStorage.setItem(
        this.getDraftKey(uid),
        JSON.stringify(updated)
      );

      // 2. Persist to Firestore driverApplications/{uid}
      const appRef = doc(db, "driverApplications", uid);
      await setDoc(appRef, {
        ...updated,
        updatedAt: serverTimestamp(),
      }, { merge: true });

      return updated;
    } catch (error) {
      console.warn("Failed to persist draft to cloud, saved locally:", error);
      const local = await AsyncStorage.getItem(this.getDraftKey(uid));
      return local ? JSON.parse(local) : (partialData as DriverApplicationRecord);
    }
  },

  /**
   * Fetch current driver application record (prioritizes Firestore, falls back to local cache)
   */
  async getDriverApplication(uid: string): Promise<DriverApplicationRecord> {
    const defaultRecord: DriverApplicationRecord = {
      applicationId: `APP-${uid.slice(0, 8).toUpperCase()}`,
      driverUid: uid,
      currentStep: 1,
      status: "DRAFT",
      lastUpdatedDate: new Date().toISOString(),
      referenceNumber: `CARRY-DRV-${new Date().getFullYear()}-${uid.slice(0, 4).toUpperCase()}`,
      driverApproval: "pending",
      vehicleApproval: "pending",
      bankVerification: "pending",
      vehicles: [],
      correctionItems: [],
      declarationAccepted: false,
      termsAccepted: false,
    };

    try {
      const snap = await getDoc(doc(db, "driverApplications", uid));
      if (snap.exists()) {
        const cloudData = snap.data() as DriverApplicationRecord;
        await AsyncStorage.setItem(
          this.getDraftKey(uid),
          JSON.stringify(cloudData)
        );
        return cloudData;
      }
    } catch (e) {
      console.log("Firestore draft read failed, checking local cache:", e);
    }

    const local = await AsyncStorage.getItem(this.getDraftKey(uid));
    if (local) {
      try {
        return JSON.parse(local);
      } catch {
        // ignore JSON parse error
      }
    }

    return defaultRecord;
  },

  /**
   * Securely uploads an image to Firebase Storage and returns its storage path & download URL
   */
  async uploadDocumentImage(
    uid: string,
    fileUri: string,
    folder: "identity" | "licence" | "vehicle" | "profile"
  ): Promise<{ downloadUrl: string; storagePath: string }> {
    const timestamp = Date.now();
    const fileName = `${folder}_${timestamp}.jpg`;
    const storagePath = `driver-documents/${uid}/${folder}/${fileName}`;

    try {
      // Fetch the binary data from the local file URI
      const response = await fetch(fileUri);
      const blob = await response.blob();

      const storageReference = ref(storage, storagePath);
      const uploadTask = await uploadBytesResumable(storageReference, blob, {
        contentType: "image/jpeg",
        customMetadata: {
          driverUid: uid,
          folderCategory: folder,
          uploadedAt: new Date().toISOString(),
        },
      });

      const downloadUrl = await getDownloadURL(uploadTask.ref);
      return { downloadUrl, storagePath };
    } catch (error: any) {
      console.warn("Storage upload failed, falling back to local file URI for development:", error);
      // Fallback for offline/development environments: preserve local URI
      return {
        downloadUrl: fileUri,
        storagePath: `local://driver-documents/${uid}/${folder}/${fileName}`,
      };
    }
  },

  /**
   * Final submission of the 12-step application
   */
  async submitApplication(uid: string): Promise<DriverApplicationRecord> {
    const app = await this.getDriverApplication(uid);

    // Validate mandatory fields
    if (!app.personalDetails?.fullName || !app.personalDetails?.verifiedPhone) {
      throw new Error("Personal details are incomplete.");
    }
    if (!app.profilePhotoUrl) {
      throw new Error("Profile photograph is required.");
    }
    if (!app.identityDoc?.frontImageUrl) {
      throw new Error("Identity document image is required.");
    }
    if (!app.licenceDetails?.frontImageUrl) {
      throw new Error("Driving licence document image is required.");
    }
    if (!app.vehicles || app.vehicles.length === 0) {
      throw new Error("At least one registered vehicle is required.");
    }
    if (!app.bankDetails?.accountNumberMasked || !app.bankDetails?.ifscCode) {
      throw new Error("Bank details are required.");
    }
    if (!app.declarationAccepted) {
      throw new Error("You must agree to the accuracy declaration before submitting.");
    }

    const referenceNumber = `CARRY-DRV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const submissionDate = new Date().toISOString();

    const submittedRecord: DriverApplicationRecord = {
      ...app,
      status: "SUBMITTED",
      submissionDate,
      lastUpdatedDate: submissionDate,
      referenceNumber,
      driverApproval: "pending",
      vehicleApproval: "pending",
      bankVerification: "pending",
    };

    // Update driverApplications collection
    await setDoc(doc(db, "driverApplications", uid), {
      ...submittedRecord,
      updatedAt: serverTimestamp(),
      submittedAt: serverTimestamp(),
    }, { merge: true });

    // Update users/{uid} collection
    await setDoc(doc(db, "users", uid), {
      roles: ["customer", "driver"],
      activePortal: "driver",
      driverVerificationStatus: "pending",
      updatedAt: serverTimestamp(),
    }, { merge: true });

    // Update drivers/{uid}
    await setDoc(doc(db, "drivers", uid), {
      userId: uid,
      fullName: app.personalDetails.fullName,
      phone: app.personalDetails.verifiedPhone,
      email: app.personalDetails.email || "",
      verificationStatus: "pending",
      onlineStatus: false,
      serviceAreas: app.servicePreferences?.preferredLocalities || ["Gandhipuram (Central Hub)"],
      referenceNumber,
      submissionDate,
      updatedAt: serverTimestamp(),
    }, { merge: true });

    // Update local cache
    await AsyncStorage.setItem(
      this.getDraftKey(uid),
      JSON.stringify(submittedRecord)
    );

    return submittedRecord;
  },

  /**
   * Resubmit a specific corrected document after admin requested correction
   */
  async resubmitCorrection(
    uid: string,
    correctionId: string,
    newFileUri: string
  ): Promise<DriverApplicationRecord> {
    const app = await this.getDriverApplication(uid);
    const item = app.correctionItems.find((c) => c.id === correctionId);
    if (!item) {
      throw new Error("Correction item not found.");
    }

    const { downloadUrl } = await this.uploadDocumentImage(
      uid,
      newFileUri,
      item.section === "vehicle" ? "vehicle" : "identity"
    );

    // Mark correction resolved
    const updatedCorrections = app.correctionItems.map((c) =>
      c.id === correctionId ? { ...c, resolved: true } : c
    );

    const hasPendingCorrections = updatedCorrections.some((c) => !c.resolved);
    const nextStatus: DriverApplicationStatus = hasPendingCorrections
      ? "NEEDS_CORRECTION"
      : "UNDER_REVIEW";

    // Update document reference
    if (item.section === "identity" && app.identityDoc) {
      app.identityDoc.frontImageUrl = downloadUrl;
      app.identityDoc.verificationStatus = "pending";
    } else if (item.section === "licence" && app.licenceDetails) {
      app.licenceDetails.frontImageUrl = downloadUrl;
      app.licenceDetails.verificationStatus = "pending";
    } else if (item.section === "profile_photo") {
      app.profilePhotoUrl = downloadUrl;
    }

    const updatedApp: DriverApplicationRecord = {
      ...app,
      status: nextStatus,
      correctionItems: updatedCorrections,
      lastUpdatedDate: new Date().toISOString(),
    };

    await this.saveDraftProgress(uid, updatedApp);
    return updatedApp;
  },

  /**
   * ADMIN WORKFLOW: Review & update driver application status
   */
  async adminReviewDriver(
    adminUid: string,
    driverUid: string,
    decision: "APPROVED" | "REJECTED" | "NEEDS_CORRECTION",
    remarks: string,
    correctionDetails?: {
      section: "identity" | "licence" | "vehicle" | "vehicle_doc" | "bank" | "profile_photo";
      documentType: string;
      reason: string;
    }
  ): Promise<DriverApplicationRecord> {
    const app = await this.getDriverApplication(driverUid);
    const previousStatus = app.status;

    let driverApproval: ApprovalLevelStatus = "pending";
    if (decision === "APPROVED") driverApproval = "verified";
    if (decision === "REJECTED") driverApproval = "rejected";
    if (decision === "NEEDS_CORRECTION") driverApproval = "needs_correction";

    const corrections = [...app.correctionItems];
    if (decision === "NEEDS_CORRECTION" && correctionDetails) {
      corrections.push({
        id: `CORR-${Date.now()}`,
        section: correctionDetails.section,
        documentType: correctionDetails.documentType,
        rejectionReason: correctionDetails.reason,
        requiredAction: `Please upload a clear, valid copy of your ${correctionDetails.documentType}.`,
        submittedAt: new Date().toISOString(),
        resolved: false,
      });
    }

    const updated: DriverApplicationRecord = {
      ...app,
      status: decision,
      driverApproval,
      adminRemarks: remarks,
      correctionItems: corrections,
      lastUpdatedDate: new Date().toISOString(),
    };

    // Update Firestore
    await setDoc(doc(db, "driverApplications", driverUid), {
      ...updated,
      updatedAt: serverTimestamp(),
    }, { merge: true });

    // Update users/{uid}
    await setDoc(doc(db, "users", driverUid), {
      driverVerificationStatus: decision === "APPROVED" ? "approved" : decision === "REJECTED" ? "rejected" : "pending",
      roles: ["customer", "driver"],
      updatedAt: serverTimestamp(),
    }, { merge: true });

    // Record audit log
    const auditLog: AdminAuditLog = {
      id: `AUDIT-${Date.now()}`,
      adminUid,
      driverUid,
      action: decision === "APPROVED" ? "APPROVE_DRIVER" : decision === "REJECTED" ? "REJECT_DRIVER" : "REQUEST_CORRECTION",
      previousStatus,
      newStatus: decision,
      reason: remarks,
      timestamp: new Date().toISOString(),
    };
    await setDoc(doc(db, "adminAuditLogs", auditLog.id), auditLog);

    return updated;
  },

  /**
   * ADMIN WORKFLOW: Review specific vehicle independently
   */
  async adminReviewVehicle(
    adminUid: string,
    driverUid: string,
    vehicleId: string,
    decision: "verified" | "rejected" | "needs_correction",
    remarks: string
  ): Promise<DriverApplicationRecord> {
    const app = await this.getDriverApplication(driverUid);
    const updatedVehicles = app.vehicles.map((v) => {
      if (v.id === vehicleId) {
        return {
          ...v,
          approvalStatus: decision,
          rejectionReason: decision !== "verified" ? remarks : undefined,
          updatedAt: new Date().toISOString(),
        };
      }
      return v;
    });

    const anyVehicleVerified = updatedVehicles.some((v) => v.approvalStatus === "verified");

    const updated: DriverApplicationRecord = {
      ...app,
      vehicles: updatedVehicles,
      vehicleApproval: anyVehicleVerified ? "verified" : decision,
      lastUpdatedDate: new Date().toISOString(),
    };

    await this.saveDraftProgress(driverUid, updated);
    return updated;
  },

  /**
   * ADMIN WORKFLOW: Review bank details independently
   */
  async adminReviewBank(
    adminUid: string,
    driverUid: string,
    decision: "verified" | "rejected",
    remarks: string
  ): Promise<DriverApplicationRecord> {
    const app = await this.getDriverApplication(driverUid);
    if (!app.bankDetails) throw new Error("No bank details found to verify.");

    const updatedBank = {
      ...app.bankDetails,
      verificationStatus: decision,
      adminRemarks: remarks,
    };

    const updated: DriverApplicationRecord = {
      ...app,
      bankDetails: updatedBank,
      bankVerification: decision,
      lastUpdatedDate: new Date().toISOString(),
    };

    await this.saveDraftProgress(driverUid, updated);
    return updated;
  },
};
