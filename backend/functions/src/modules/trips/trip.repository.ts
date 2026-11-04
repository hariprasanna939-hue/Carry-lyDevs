import { db } from '../../config/firebase';
import { COLLECTIONS } from '../../config/collections';

export class TripRepository {
  public static async getActiveTripForDriver(driverId: string) {
    const snap = await db
      .collection(COLLECTIONS.BOOKINGS)
      .where('driverId', '==', driverId)
      .where('status', 'in', ['accepted', 'arrived_at_pickup', 'loading', 'in_transit', 'arrived_at_drop', 'unloading'])
      .limit(1)
      .get();

    return snap.empty ? null : snap.docs[0].data();
  }
}
