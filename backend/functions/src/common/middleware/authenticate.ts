import { CallableRequest } from 'firebase-functions/v2/https';
import { AppError } from '../errors/AppError';

export function assertAuthenticated(request: CallableRequest): string {
  if (!request.auth || !request.auth.uid) {
    throw new AppError('unauthenticated', 'User must be authenticated to invoke this action');
  }
  return request.auth.uid;
}
