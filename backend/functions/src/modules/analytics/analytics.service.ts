import { CustomerMetricsCalculator } from './customerMetrics';
import { DriverMetricsCalculator } from './driverMetrics';
import { RevenueMetricsCalculator } from './revenueMetrics';
import { db } from '../../config/firebase';
import { COLLECTIONS } from '../../config/collections';

export class AnalyticsService {
  /**
   * 1. Booking Counts
   */
  public static async getBookingCounts() {
    const snap = await db.collection(COLLECTIONS.BOOKINGS).get();
    let total = 0;
    let created = 0;
    let searching = 0;
    let inProgress = 0;
    let completed = 0;
    let cancelled = 0;

    snap.docs.forEach((doc) => {
      total++;
      const s = doc.data().status;
      if (s === 'created') created++;
      else if (s === 'searching') searching++;
      else if (s === 'completed') completed++;
      else if (s === 'cancelled') cancelled++;
      else inProgress++;
    });

    return { total, created, searching, inProgress, completed, cancelled };
  }

  /**
   * 2. Active Drivers
   */
  public static async getActiveDriversCount() {
    const onlineSnap = await db
      .collection(COLLECTIONS.DRIVER_PROFILES)
      .where('onlineStatus', '==', true)
      .where('verificationStatus', '==', 'approved')
      .get();

    const totalApprovedSnap = await db
      .collection(COLLECTIONS.DRIVER_PROFILES)
      .where('verificationStatus', '==', 'approved')
      .get();

    return {
      activeOnlineDrivers: onlineSnap.size,
      totalApprovedDrivers: totalApprovedSnap.size,
    };
  }

  /**
   * 3. Revenue
   */
  public static async getRevenueSummary(dateString?: string) {
    const targetDate = dateString || new Date().toISOString().slice(0, 10);
    return RevenueMetricsCalculator.getDailyRevenue(targetDate);
  }

  /**
   * 4. Cancellations and Completion Rates
   */
  public static async getCancellationAndCompletionRates() {
    const snap = await db.collection(COLLECTIONS.BOOKINGS).get();
    const total = snap.size;
    if (total === 0) {
      return { totalBookings: 0, completionRate: 0, cancellationRate: 0 };
    }

    let completed = 0;
    let cancelled = 0;

    snap.docs.forEach((doc) => {
      const s = doc.data().status;
      if (s === 'completed') completed++;
      else if (s === 'cancelled') cancelled++;
    });

    const completionRate = Math.round((completed / total) * 10000) / 100;
    const cancellationRate = Math.round((cancelled / total) * 10000) / 100;

    return {
      totalBookings: total,
      completedCount: completed,
      cancelledCount: cancelled,
      completionRatePercent: completionRate,
      cancellationRatePercent: cancellationRate,
    };
  }

  public static async getCustomerStats(customerId: string) {
    return CustomerMetricsCalculator.getCustomerStats(customerId);
  }

  public static async getDriverStats(driverId: string) {
    return DriverMetricsCalculator.getDriverStats(driverId);
  }
}
