import { db } from '../../config/firebase';
import { COLLECTIONS } from '../../config/collections';

export class DriverMetricsCalculator {
  public static async getDriverStats(driverId: string) {
    const snap = await db.collection(COLLECTIONS.BOOKINGS).where('driverId', '==', driverId).get();
    const total = snap.size;
    let completed = 0;
    let totalEarnings = 0;

    snap.docs.forEach((doc) => {
      const data = doc.data();
      if (data.status === 'completed') {
        completed++;
        // Driver gets ~80% of fare after platform commission
        totalEarnings += Math.round((data.totalFare || 0) * 0.8);
      }
    });

    return { totalAssigned: total, completedTrips: completed, totalEarnings };
  }
}
