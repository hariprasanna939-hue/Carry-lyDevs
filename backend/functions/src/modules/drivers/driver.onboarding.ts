import { DriverRepository } from './driver.repository';
import { DriverDocumentsManager } from './driver.documents';
import { SubmitDriverApplicationInput, DriverProfile } from './driver.types';
import { db } from '../../config/firebase';
import { COLLECTIONS } from '../../config/collections';
import { getIsoTimestamp } from '../../common/utils/timestamps';
import { generateId } from '../../common/utils/generateId';

export class DriverOnboardingWorkflow {
  public static async processApplication(driverId: string, email: string, input: SubmitDriverApplicationInput): Promise<DriverProfile> {
    const now = getIsoTimestamp();
    const existing = await DriverRepository.getById(driverId);

    const vehicleId = generateId('veh');
    await db.collection(COLLECTIONS.VEHICLES).doc(vehicleId).set({
      id: vehicleId,
      driverId,
      vehicleType: input.vehicleType,
      vehicleSize: input.vehicleType,
      registrationNumber: input.vehicleRegistrationNumber,
      capacityKg: input.capacityKg || 500,
      verificationStatus: 'pending',
      isActive: true,
      createdAt: now,
      updatedAt: now,
    });

    await DriverDocumentsManager.saveDocuments(driverId, input.documents);

    // Write to driverApplications/{uid}
    const docReferences: Record<string, string> = {};
    for (const d of input.documents) {
      docReferences[d.type] = d.frontUrl;
    }

    await db.collection(COLLECTIONS.DRIVER_APPLICATIONS).doc(driverId).set({
      personalDetails: {
        fullName: input.fullName,
        phone: input.phone,
        email,
        city: 'Coimbatore',
      },
      identityDetails: {
        aadhaarFrontUrl: docReferences.aadhaar || '',
        panCardUrl: docReferences.pan || '',
      },
      drivingDetails: {
        licenseNumber: docReferences.licenseNumber || '',
        licenseFrontUrl: docReferences.driving_license || '',
      },
      vehicleDetails: {
        vehicleType: input.vehicleType,
        vehicleSize: input.vehicleType,
        registrationNumber: input.vehicleRegistrationNumber,
        capacityKg: input.capacityKg || 500,
        rcDocUrl: docReferences.rc || '',
        insuranceDocUrl: docReferences.insurance || '',
      },
      documentReferences: docReferences,
      onboardingCompleted: true,
      approvalStatus: 'pending',
      submittedAt: now,
    }, { merge: true });

    // Write to drivers/{uid}
    const driverRecord = {
      isAvailable: false,
      activeVehicleId: vehicleId,
      rating: existing?.rating || 5.0,
      completedTrips: existing?.totalTrips || 0,
      updatedAt: now,
    };
    await db.collection(COLLECTIONS.DRIVERS).doc(driverId).set(driverRecord, { merge: true });

    const profile: DriverProfile = {
      userId: driverId,
      fullName: input.fullName,
      phone: input.phone,
      email,
      verificationStatus: 'pending',
      onlineStatus: false,
      serviceAreas: input.serviceAreas || ['Coimbatore'],
      activeVehicleId: vehicleId,
      rating: existing?.rating || 5.0,
      totalTrips: existing?.totalTrips || 0,
      totalEarnings: existing?.totalEarnings || 0,
      documentsSubmittedAt: now,
      createdAt: existing ? existing.createdAt : now,
      updatedAt: now,
    };

    await DriverRepository.save(profile);

    // Update user profile roles
    const userRef = db.collection(COLLECTIONS.USERS).doc(driverId);
    const userDoc = await userRef.get();
    if (userDoc.exists) {
      const uData = userDoc.data();
      const roles = Array.from(new Set([...(uData?.roles || ['customer']), 'driver']));
      await userRef.update({
        role: 'driver',
        roles,
        driverVerificationStatus: 'pending',
        updatedAt: now,
      });
    }

    return profile;
  }
}
