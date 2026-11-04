import { DriverRepository } from '../drivers/driver.repository';
import { AdminAuditLogger } from './admin.audit';
import { AppError } from '../../common/errors/AppError';
import { getIsoTimestamp } from '../../common/utils/timestamps';
import { auth, db } from '../../config/firebase';
import { COLLECTIONS } from '../../config/collections';

export class AdminDriverApproval {
  public static async approveDriver(adminId: string, driverId: string) {
    const driver = await DriverRepository.getById(driverId);
    if (!driver) throw new AppError('not-found', 'Driver not found');

    const now = getIsoTimestamp();
    await DriverRepository.update(driverId, {
      verificationStatus: 'approved',
      approvedAt: now,
      updatedAt: now,
    });

    // 1. Update driverApplications/{driverId}
    await db.collection(COLLECTIONS.DRIVER_APPLICATIONS).doc(driverId).set(
      {
        approvalStatus: 'approved',
        reviewedAt: now,
        reviewedBy: adminId,
        updatedAt: now,
      },
      { merge: true }
    );

    // 2. Update drivers/{driverId}
    await db.collection(COLLECTIONS.DRIVERS).doc(driverId).set(
      {
        verificationStatus: 'approved',
        updatedAt: now,
      },
      { merge: true }
    );

    // 3. Update users/{driverId} & custom user claims
    const userRef = db.collection(COLLECTIONS.USERS).doc(driverId);
    const userDoc = await userRef.get();
    if (userDoc.exists) {
      const uData = userDoc.data();
      const roles = Array.from(new Set([...(uData?.roles || []), 'driver']));
      await userRef.update({
        role: 'driver',
        roles,
        driverVerificationStatus: 'approved',
        updatedAt: now,
      });
      await auth.setCustomUserClaims(driverId, {
        roles,
        activePortal: 'driver',
      });
    }

    await AdminAuditLogger.logAction(adminId, 'APPROVE_DRIVER', 'driver', driverId);
    return { driverId, status: 'approved', approvedAt: now };
  }

  public static async rejectDriver(adminId: string, driverId: string, reason: string) {
    const driver = await DriverRepository.getById(driverId);
    if (!driver) throw new AppError('not-found', 'Driver not found');

    const now = getIsoTimestamp();
    await DriverRepository.update(driverId, {
      verificationStatus: 'rejected',
      rejectionReason: reason,
      updatedAt: now,
    });

    // 1. Update driverApplications/{driverId}
    await db.collection(COLLECTIONS.DRIVER_APPLICATIONS).doc(driverId).set(
      {
        approvalStatus: 'rejected',
        rejectionReason: reason,
        reviewedAt: now,
        reviewedBy: adminId,
        updatedAt: now,
      },
      { merge: true }
    );

    // 2. Update users/{driverId}
    const userRef = db.collection(COLLECTIONS.USERS).doc(driverId);
    await userRef.set(
      {
        driverVerificationStatus: 'rejected',
        updatedAt: now,
      },
      { merge: true }
    );

    await AdminAuditLogger.logAction(adminId, 'REJECT_DRIVER', 'driver', driverId, { reason });
    return { driverId, status: 'rejected', reason };
  }
}
