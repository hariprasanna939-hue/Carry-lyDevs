import { db } from '../../config/firebase';
import { COLLECTIONS } from '../../config/collections';
import { generateId } from '../../common/utils/generateId';
import { getIsoTimestamp } from '../../common/utils/timestamps';

export class AdminAuditLogger {
  public static async logAction(
    adminId: string,
    action: string,
    targetType: string,
    targetId: string,
    details?: Record<string, unknown>
  ): Promise<void> {
    const id = generateId('audit');
    await db.collection(COLLECTIONS.AUDIT_LOGS).doc(id).set({
      id,
      adminId,
      action,
      targetType,
      targetId,
      details,
      timestamp: getIsoTimestamp(),
    });
  }
}
