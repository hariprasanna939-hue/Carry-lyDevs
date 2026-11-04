import { onCall } from 'firebase-functions/v2/https';
import { assertAuthenticated } from '../../common/middleware/authenticate';
import { validateRequest } from '../../common/middleware/validateRequest';
import { validateRegisterInput } from './auth.validation';
import { AuthService } from './auth.service';
import { handleError } from '../../common/errors/errorHandler';
import { createSuccessResponse } from '../../common/types/ApiResponse';
import { UserRole } from '../../common/types/User';

/**
 * 1. createUserProfile — Create profile after registration
 */
export const createUserProfile = onCall(async (request) => {
  try {
    const uid = assertAuthenticated(request);
    const input = validateRequest(request.data, validateRegisterInput);
    const profile = await AuthService.registerUser(uid, input);
    return createSuccessResponse(profile, 'User profile created successfully');
  } catch (error) {
    return handleError(error, 'createUserProfile');
  }
});

export const registerUser = createUserProfile;

export const validateSession = onCall(async (request) => {
  try {
    const uid = assertAuthenticated(request);
    const session = await AuthService.validateSession(uid);
    return createSuccessResponse(session, 'Session is valid');
  } catch (error) {
    return handleError(error, 'validateSession');
  }
});

export const cleanupSessionOnLogout = onCall(async (request) => {
  try {
    const uid = assertAuthenticated(request);
    const fcmToken = (request.data as { fcmToken?: string })?.fcmToken;
    const result = await AuthService.cleanupSessionOnLogout(uid, fcmToken);
    return createSuccessResponse(result, 'Session cleanup completed');
  } catch (error) {
    return handleError(error, 'cleanupSessionOnLogout');
  }
});

export const verifyUserRole = onCall(async (request) => {
  try {
    const uid = assertAuthenticated(request);
    const role = (request.data as { role?: UserRole })?.role;
    if (!role) throw new Error('role is required');
    const hasRole = await AuthService.verifyRole(uid, role);
    return createSuccessResponse({ hasRole, role });
  } catch (error) {
    return handleError(error, 'verifyUserRole');
  }
});

export const checkAccountStatus = onCall(async (request) => {
  try {
    const uid = assertAuthenticated(request);
    const status = await AuthService.checkAccountStatus(uid);
    return createSuccessResponse(status);
  } catch (error) {
    return handleError(error, 'checkAccountStatus');
  }
});
