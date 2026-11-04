import { onCall } from 'firebase-functions/v2/https';
import { assertAuthenticated } from '../../common/middleware/authenticate';
import { validateRequest } from '../../common/middleware/validateRequest';
import { validateDriverApplication, validateAvailabilityInput } from './driver.validation';
import { DriverService } from './driver.service';
import { handleError } from '../../common/errors/errorHandler';
import { createSuccessResponse } from '../../common/types/ApiResponse';

/**
 * 4. submitDriverApplication — Submit driver application
 */
export const submitDriverApplication = onCall(async (request) => {
  try {
    const driverId = assertAuthenticated(request);
    const input = validateRequest(request.data, validateDriverApplication);
    const profile = await DriverService.submitApplication(driverId, input);
    return createSuccessResponse(profile, 'Driver application submitted successfully');
  } catch (error) {
    return handleError(error, 'submitDriverApplication');
  }
});

/**
 * 5. saveDriverOnboardingDraft — Save incomplete onboarding
 */
export const saveDriverOnboardingDraft = onCall(async (request) => {
  try {
    const driverId = assertAuthenticated(request);
    const draftData = (request.data as { draft?: Record<string, unknown> })?.draft || (request.data as Record<string, unknown>) || {};
    const result = await DriverService.saveDraft(driverId, draftData);
    return createSuccessResponse(result, 'Onboarding draft saved');
  } catch (error) {
    return handleError(error, 'saveDriverOnboardingDraft');
  }
});

export const saveDriverDraft = saveDriverOnboardingDraft;

/**
 * 6. getDriverApplication — Get own onboarding information
 */
export const getDriverApplication = onCall(async (request) => {
  try {
    const driverId = assertAuthenticated(request);
    const app = await DriverService.getDriverApplication(driverId);
    return createSuccessResponse(app);
  } catch (error) {
    return handleError(error, 'getDriverApplication');
  }
});

/**
 * 7. getDriverVerificationStatus — Check pending/approved/rejected
 */
export const getDriverVerificationStatus = onCall(async (request) => {
  try {
    const driverId = assertAuthenticated(request);
    const status = await DriverService.checkApprovalStatus(driverId);
    return createSuccessResponse(status);
  } catch (error) {
    return handleError(error, 'getDriverVerificationStatus');
  }
});

export const checkDriverApproval = getDriverVerificationStatus;

/**
 * 8. updateDriverAvailability — Update online/offline status
 */
export const updateDriverAvailability = onCall(async (request) => {
  try {
    const driverId = assertAuthenticated(request);
    const input = validateRequest(request.data, validateAvailabilityInput);
    const status = await DriverService.setAvailability(driverId, input);
    return createSuccessResponse(status, 'Driver availability updated');
  } catch (error) {
    return handleError(error, 'updateDriverAvailability');
  }
});

export const updateDriverDetails = onCall(async (request) => {
  try {
    const driverId = assertAuthenticated(request);
    const updates = (request.data as { updates?: Record<string, unknown> })?.updates || {};
    const result = await DriverService.updateDetails(driverId, updates);
    return createSuccessResponse(result, 'Driver details updated');
  } catch (error) {
    return handleError(error, 'updateDriverDetails');
  }
});

export const uploadDriverDocument = onCall(async (request) => {
  try {
    const driverId = assertAuthenticated(request);
    const doc = request.data as {
      type: 'aadhaar' | 'driving_license' | 'pan' | 'rc' | 'insurance' | 'police_clearance';
      documentNumber?: string;
      frontUrl: string;
      backUrl?: string;
    };
    if (!doc?.type || !doc?.frontUrl) {
      throw new Error('type and frontUrl are required');
    }
    const result = await DriverService.uploadDocument(driverId, doc);
    return createSuccessResponse(result, 'Document uploaded successfully');
  } catch (error) {
    return handleError(error, 'uploadDriverDocument');
  }
});

export const getDriverProfile = onCall(async (request) => {
  try {
    const driverId = assertAuthenticated(request);
    const profile = await DriverService.getProfile(driverId);
    return createSuccessResponse(profile);
  } catch (error) {
    return handleError(error, 'getDriverProfile');
  }
});
