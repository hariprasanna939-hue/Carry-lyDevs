import { db } from '../../config/firebase';
import { COLLECTIONS } from '../../config/collections';
import { Booking } from '../../common/types/Booking';

export class BookingRepository {
  public static async getById(bookingId: string): Promise<Booking | null> {
    const doc = await db.collection(COLLECTIONS.BOOKINGS).doc(bookingId).get();
    return doc.exists ? (doc.data() as Booking) : null;
  }

  public static async create(booking: Booking): Promise<void> {
    await db.collection(COLLECTIONS.BOOKINGS).doc(booking.id).set(booking);
  }

  public static async update(bookingId: string, updates: Partial<Booking>): Promise<void> {
    await db.collection(COLLECTIONS.BOOKINGS).doc(bookingId).set(updates, { merge: true });
  }

  public static async getCustomerBookings(customerId: string): Promise<Booking[]> {
    const snap = await db
      .collection(COLLECTIONS.BOOKINGS)
      .where('customerId', '==', customerId)
      .orderBy('createdAt', 'desc')
      .limit(50)
      .get();
    return snap.docs.map((d) => d.data() as Booking);
  }

  public static async getDriverBookings(driverId: string): Promise<Booking[]> {
    const snap = await db
      .collection(COLLECTIONS.BOOKINGS)
      .where('driverId', '==', driverId)
      .orderBy('createdAt', 'desc')
      .limit(50)
      .get();
    return snap.docs.map((d) => d.data() as Booking);
  }
}
