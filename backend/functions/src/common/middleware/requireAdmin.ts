import { CallableRequest } from 'firebase-functions/v2/https';
import { requireRole } from './requireRole';

export async function requireAdmin(request: CallableRequest): Promise<string> {
  return requireRole(request, ['admin']);
}
