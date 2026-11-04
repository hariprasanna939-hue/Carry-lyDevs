import { db } from '../../config/firebase';
import { COLLECTIONS } from '../../config/collections';

export class RevenueMetricsCalculator {
  public static async getDailyRevenue(dateString: string) {
    const snap = await db
      .collection(COLLECTIONS.BOOKINGS)
      .where('status', '==', 'completed')
      .get();

    let grossVolume = 0;
    let tripCount = 0;

    snap.docs.forEach((doc) => {
      const data = doc.data();
      if (data.completedAt && data.completedAt.startsWith(dateString)) {
        grossVolume += data.totalFare || 0;
        tripCount++;
      }
    });

    const netPlatformMargin = Math.round(grossVolume * 0.2); // 20% commission

    return {
      date: dateString,
      completedTrips: tripCount,
      grossVolume,
      netPlatformMargin,
    };
  }
}
