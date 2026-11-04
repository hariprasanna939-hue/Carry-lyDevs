import { HttpsError } from 'firebase-functions/v2/https';
import { AppError } from './AppError';

export function handleError(error: unknown, contextName: string): never {
  console.error(`[Error in ${contextName}]:`, error);

  if (error instanceof AppError) {
    throw error.toHttpsError();
  }

  if (error instanceof HttpsError) {
    throw error;
  }

  const message = error instanceof Error ? error.message : 'An unexpected internal error occurred';
  throw new HttpsError('internal', message);
}
