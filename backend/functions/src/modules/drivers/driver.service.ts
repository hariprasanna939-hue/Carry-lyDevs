import { DriverRepository } from './driver.repository';
import { DriverOnboardingWorkflow } from './driver.onboarding';
import { DriverAvailabilityManager } from './driver.availability';
import { DriverDocumentsManager } from './driver.documents';
import { SubmitDriverApplicationInput, UpdateAvailabilityInput, DriverProfile } from './driver.types';
import { AppError } from '../../common/errors/AppError';
import { db } from '../../config/firebase';
import { COLLECTIONS } from '../../config/collections';
import { getIsoTimestamp } from '../../common/utils/timestamps';

export class DriverService {
  /**
   * 4. Submit Onboarding Application
   */
  public static async submitApplication(driverId: string, input: SubmitDriverApplicationInput) {
    const userDoc = await db.collection(COLLECTIONS.USERS).doc(driverId).get();
    const email = userDoc.data()?.email || '';
    return DriverOnboardingWorkflow.processApplication(driverId, email, input);
  }

  /**
   * 5. Save Onboarding Draft
   */
  public static async saveDraft(driverId: string, draftData: Record<string, unknown>) {
    const now = getIsoTimestamp();
    await db.collection(COLLECTIONS.DRIVER_APPLICATIONS).doc(driverId).set(
      {
        personalDetails: draftData.personalDetails || {},
        identityDetails: draftData.identityDetails || {},
        drivingDetails: draftData.drivingDetails || {},
        vehicleDetails: draftData.vehicleDetails || {},
        documentReferences: draftData.documentReferences || {},
        onboardingCompleted: false,
        approvalStatus: 'unsubmitted',
        draft: draftData,
        updatedAt: now,
      },
      { merge: true }
    );
    return { driverId, saved: true, updatedAt: now };
  }

  /**
   * 6. Get Driver Application (own onboarding information)
   */
  public static async getDriverApplication(driverId: string) {
    const doc = await db.collection(COLLECTIONS.DRIVER_APPLICATIONS).doc(driverId).get();
    if (!doc.exists) {
      return {
        driverId,
        exists: false,
        approvalStatus: 'unsubmitted',
        onboardingCompleted: false,
      };
    }
    return {
      driverId,
      exists: true,
      ...doc.data(),
    };
  }

  /**
   * 7. Check Verification Status
   */
  public static async checkApprovalStatus(driverId: string) {
    const appDoc = await db.collection(COLLECTIONS.DRIVER_APPLICATIONS).doc(driverId).get();
    if (appDoc.exists) {
      const data = appDoc.data();
      return {
        driverId,
        verificationStatus: data?.approvalStatus || 'pending',
        approvalStatus: data?.approvalStatus || 'pending',
        rejectionReason: data?.rejectionReason || null,
        submittedAt: data?.submittedAt || null,
        reviewedAt: data?.reviewedAt || null,
      };
    }

    const driver = await this.getProfile(driverId);
    return {
      driverId,
      verificationStatus: driver.verificationStatus,
      approvalStatus: driver.verificationStatus,
      rejectionReason: driver.rejectionReason || null,
      approvedAt: driver.approvedAt || null,
      documentsSubmittedAt: driver.documentsSubmittedAt || null,
    };
  }

  /**
   * 8. Update Availability
   */
  public static async setAvailability(driverId: string, input: UpdateAvailabilityInput) {
    return DriverAvailabilityManager.setOnlineStatus(
      driverId,
      input.onlineStatus,
      input.latitude && input.longitude ? { latitude: input.latitude, longitude: input.longitude } : undefined
    );
  }

  /**
   * Update Details
   */
  public static async updateDetails(driverId: string, updates: Partial<DriverProfile>) {
    const driver = await this.getProfile(driverId);
    const sanitized: Record<string, unknown> = {
      updatedAt: getIsoTimestamp(),
    };
    if (updates.fullName) sanitized.fullName = updates.fullName;
    if (updates.phone) sanitized.phone = updates.phone;
    if (updates.serviceAreas) sanitized.serviceAreas = updates.serviceAreas;

    await DriverRepository.update(driverId, sanitized);
    return { ...driver, ...sanitized };
  }

  /**
   * Upload Document
   */
  public static async uploadDocument(
    driverId: string,
    doc: {
      type: 'aadhaar' | 'driving_license' | 'pan' | 'rc' | 'insurance' | 'police_clearance';
      documentNumber?: string;
      frontUrl: string;
      backUrl?: string;
    }
  ) {
    await DriverDocumentsManager.saveDocuments(driverId, [doc]);
    return { driverId, documentType: doc.type, uploaded: true };
  }

  public static async getProfile(driverId: string) {
    const driver = await DriverRepository.getById(driverId);
    if (!driver) throw new AppError('not-found', 'Driver profile not found');
    return driver;
  }
}
