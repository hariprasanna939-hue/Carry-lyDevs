import { onCall } from 'firebase-functions/v2/https';
import { assertAuthenticated } from '../../common/middleware/authenticate';
import { validateRequest } from '../../common/middleware/validateRequest';
import { validateUpdateProfileInput, validateSwitchPortalInput } from './user.validation';
import { UserService } from './user.service';
import { handleError } from '../../common/errors/errorHandler';
import { createSuccessResponse } from '../../common/types/ApiResponse';

/**
 * 2. getMyProfile — Get authenticated profile
 */
export const getMyProfile = onCall(async (request) => {
  try {
    const uid = assertAuthenticated(request);
    const profile = await UserService.getProfile(uid);
    return createSuccessResponse(profile);
  } catch (error) {
    return handleError(error, 'getMyProfile');
  }
});

export const getUserProfile = getMyProfile;

/**
 * 3. updateMyProfile — Update permitted profile fields
 */
export const updateMyProfile = onCall(async (request) => {
  try {
    const uid = assertAuthenticated(request);
    const input = validateRequest(request.data, validateUpdateProfileInput);
    const updated = await UserService.updateProfile(uid, input);
    return createSuccessResponse(updated, 'Profile updated successfully');
  } catch (error) {
    return handleError(error, 'updateMyProfile');
  }
});

export const updateUserProfile = updateMyProfile;

export const uploadUserPhoto = onCall(async (request) => {
  try {
    const uid = assertAuthenticated(request);
    const photoURL = (request.data as { photoURL?: string })?.photoURL;
    if (!photoURL) throw new Error('photoURL is required');
    const result = await UserService.updateUserPhoto(uid, photoURL);
    return createSuccessResponse(result, 'User photo updated');
  } catch (error) {
    return handleError(error, 'uploadUserPhoto');
  }
});

export const deactivateAccount = onCall(async (request) => {
  try {
    const uid = assertAuthenticated(request);
    const reason = (request.data as { reason?: string })?.reason;
    const result = await UserService.deactivateAccount(uid, reason);
    return createSuccessResponse(result, 'Account deactivated successfully');
  } catch (error) {
    return handleError(error, 'deactivateAccount');
  }
});

export const switchPortal = onCall(async (request) => {
  try {
    const uid = assertAuthenticated(request);
    const input = validateRequest(request.data, validateSwitchPortalInput);
    const result = await UserService.switchPortal(uid, input);
    return createSuccessResponse(result, 'Switched portal successfully');
  } catch (error) {
    return handleError(error, 'switchPortal');
  }
});
