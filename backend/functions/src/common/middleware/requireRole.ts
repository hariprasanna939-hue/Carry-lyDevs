import { CallableRequest } from 'firebase-functions/v2/https';
import { AppError } from '../errors/AppError';
import { UserRole } from '../types/User';
import { db } from '../../config/firebase';
import { COLLECTIONS } from '../../config/collections';

export async function requireRole(
  request: CallableRequest,
  allowedRoles: UserRole[]
): Promise<string> {
  if (!request.auth || !request.auth.uid) {
    throw new AppError('unauthenticated', 'User must be authenticated');
  }

  const uid = request.auth.uid;
  const userDoc = await db.collection(COLLECTIONS.USERS).doc(uid).get();

  if (!userDoc.exists) {
    throw new AppError('not-found', 'User profile not found');
  }

  const userData = userDoc.data();
  const roles: string[] = userData?.roles || [];

  const hasAllowedRole = allowedRoles.some((role) => roles.includes(role));
  if (!hasAllowedRole) {
    throw new AppError('permission-denied', `Requires one of roles: [${allowedRoles.join(', ')}]`);
  }

  return uid;
}
