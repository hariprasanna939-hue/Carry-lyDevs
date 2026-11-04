import { db } from '../../config/firebase';
import { COLLECTIONS } from '../../config/collections';

export class CustomerMetricsCalculator {
  public static async getCustomerStats(customerId: string) {
    const snap = await db.collection(COLLECTIONS.BOOKINGS).where('customerId', '==', customerId).get();
    const total = snap.size;
    let completed = 0;
    let totalSpend = 0;

    snap.docs.forEach((doc) => {
      const data = doc.data();
      if (data.status === 'completed') {
        completed++;
        totalSpend += data.totalFare || 0;
      }
    });

    return { totalBookings: total, completedBookings: completed, totalSpend };
  }
}
