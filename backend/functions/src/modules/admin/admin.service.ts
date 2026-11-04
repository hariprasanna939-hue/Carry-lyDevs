import { AdminDriverApproval } from './driverApproval';
import { AdminBookingManagement } from './bookingManagement';
import { AdminUserManagement } from './userManagement';
import { AdminPricingManagement } from './pricingManagement';
import { AdminAuditLogger } from './admin.audit';
import { db } from '../../config/firebase';
import { COLLECTIONS } from '../../config/collections';
import { getIsoTimestamp } from '../../common/utils/timestamps';

export class AdminService {
  /**
   * 1. Approve / Reject Drivers
   */
  public static async approveDriver(adminId: string, driverId: string) {
    return AdminDriverApproval.approveDriver(adminId, driverId);
  }

  public static async rejectDriver(adminId: string, driverId: string, reason: string) {
    return AdminDriverApproval.rejectDriver(adminId, driverId, reason);
  }

  /**
   * 2. Manage Bookings
   */
  public static async cancelBooking(adminId: string, bookingId: string, reason: string) {
    return AdminBookingManagement.cancelBookingByAdmin(adminId, bookingId, reason);
  }

  public static async listBookings(adminId: string, status?: string) {
    let query = db.collection(COLLECTIONS.BOOKINGS).orderBy('createdAt', 'desc').limit(100);
    if (status) {
      query = db.collection(COLLECTIONS.BOOKINGS).where('status', '==', status).orderBy('createdAt', 'desc').limit(100);
    }
    const snap = await query.get();
    return snap.docs.map((d) => d.data());
  }

  /**
   * 3. Manage Users
   */
  public static async suspendUser(adminId: string, targetUid: string, reason: string) {
    return AdminUserManagement.suspendUser(adminId, targetUid, reason);
  }

  public static async activateUser(adminId: string, targetUid: string) {
    return AdminUserManagement.activateUser(adminId, targetUid);
  }

  public static async listUsers(adminId: string, role?: string) {
    let query = db.collection(COLLECTIONS.USERS).limit(100);
    if (role) {
      query = db.collection(COLLECTIONS.USERS).where('roles', 'array-contains', role).limit(100);
    }
    const snap = await query.get();
    return snap.docs.map((d) => d.data());
  }

  /**
   * 4. Manage Pricing
   */
  public static async updatePricing(adminId: string, city: string, pricingData: Record<string, unknown>) {
    return AdminPricingManagement.updateCityPricing(adminId, city, pricingData);
  }

  /**
   * 5. Manage Disputes
   */
  public static async resolveDispute(
    adminId: string,
    disputeId: string,
    outcome: string,
    refundAmount?: number
  ) {
    const docRef = db.collection(COLLECTIONS.SUPPORT_TICKETS).doc(disputeId);
    const now = getIsoTimestamp();

    await docRef.set(
      {
        status: 'resolved',
        disputeOutcome: outcome,
        refundAmount: refundAmount || 0,
        resolvedBy: adminId,
        resolvedAt: now,
        updatedAt: now,
      },
      { merge: true }
    );

    await AdminAuditLogger.logAction(adminId, 'RESOLVE_DISPUTE', 'dispute', disputeId, { outcome, refundAmount });
    return { disputeId, resolved: true, outcome, refundAmount };
  }
}
