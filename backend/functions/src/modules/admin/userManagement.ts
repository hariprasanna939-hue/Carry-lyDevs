import { UserRepository } from '../users/user.repository';
import { AdminAuditLogger } from './admin.audit';
import { AppError } from '../../common/errors/AppError';
import { getIsoTimestamp } from '../../common/utils/timestamps';

export class AdminUserManagement {
  public static async suspendUser(adminId: string, targetUid: string, reason: string) {
    const user = await UserRepository.getById(targetUid);
    if (!user) throw new AppError('not-found', 'User not found');

    await UserRepository.update(targetUid, {
      accountStatus: 'suspended',
      updatedAt: getIsoTimestamp(),
    });

    await AdminAuditLogger.logAction(adminId, 'SUSPEND_USER', 'user', targetUid, { reason });
    return { targetUid, accountStatus: 'suspended' };
  }

  public static async activateUser(adminId: string, targetUid: string) {
    const user = await UserRepository.getById(targetUid);
    if (!user) throw new AppError('not-found', 'User not found');

    await UserRepository.update(targetUid, {
      accountStatus: 'active',
      updatedAt: getIsoTimestamp(),
    });

    await AdminAuditLogger.logAction(adminId, 'ACTIVATE_USER', 'user', targetUid);
    return { targetUid, accountStatus: 'active' };
  }
}
