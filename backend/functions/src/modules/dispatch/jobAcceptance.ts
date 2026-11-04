import { db } from '../../config/firebase';
import { COLLECTIONS } from '../../config/collections';
import { AppError } from '../../common/errors/AppError';
import { getIsoTimestamp } from '../../common/utils/timestamps';
import { Booking } from '../../common/types/Booking';
import { DriverProfile } from '../../common/types/Driver';

export class JobAcceptanceManager {
  /**
   * CRITICAL TRANSACTION:
   * Atomically accepts a booking for a driver.
   * Guarantees that two drivers cannot accept the same trip simultaneously.
   */
  public static async acceptBookingAtomically(bookingId: string, driverId: string) {
    const bookingRef = db.collection(COLLECTIONS.BOOKINGS).doc(bookingId);
    const driverRef = db.collection(COLLECTIONS.DRIVERS).doc(driverId);
    const tripRef = db.collection(COLLECTIONS.TRIPS).doc(bookingId);

    return db.runTransaction(async (transaction) => {
      const [bookingDoc, driverDoc] = await Promise.all([
        transaction.get(bookingRef),
        transaction.get(driverRef),
      ]);

      if (!bookingDoc.exists) {
        throw new AppError('not-found', 'Booking does not exist');
      }

      if (!driverDoc.exists) {
        // Fallback to check driverProfiles
        const legacyDoc = await transaction.get(db.collection('driverProfiles').doc(driverId));
        if (!legacyDoc.exists) {
          throw new AppError('not-found', 'Driver profile does not exist');
        }
      }

      const bookingData = bookingDoc.data() as Booking;
      const driverData = (driverDoc.exists ? driverDoc.data() : {}) as Partial<DriverProfile>;

      // 1. Verify driver is approved
      if (driverData.verificationStatus !== 'approved' && driverData.verificationStatus !== undefined) {
        throw new AppError('failed-precondition', 'Only approved drivers can accept trips');
      }

      // 2. Verify booking is still open for acceptance
      if (bookingData.status !== 'searching' && bookingData.status !== 'created') {
        throw new AppError(
          'aborted',
          `Booking has already been ${bookingData.status === 'accepted' ? 'taken by another driver' : bookingData.status}`
        );
      }

      if (bookingData.driverId) {
        throw new AppError('aborted', 'This booking has already been assigned to another driver');
      }

      const now = getIsoTimestamp();

      // 3. Atomically update the booking
      transaction.update(bookingRef, {
        driverId,
        vehicleId: driverData.activeVehicleId || null,
        status: 'accepted',
        bookingStatus: 'accepted',
        acceptedAt: now,
        updatedAt: now,
      });

      // 4. Initialize trip document in trips/{tripId}
      transaction.set(tripRef, {
        bookingId,
        customerId: bookingData.customerId,
        driverId,
        tripStatus: 'accepted',
        createdAt: now,
        updatedAt: now,
      }, { merge: true });

      return {
        bookingId,
        driverId,
        status: 'accepted',
        acceptedAt: now,
      };
    });
  }

  /**
   * Rejects a booking request by a driver and appends driverId to rejectionHistory.
   */
  public static async rejectBooking(bookingId: string, driverId: string) {
    const bookingRef = db.collection(COLLECTIONS.BOOKINGS).doc(bookingId);

    return db.runTransaction(async (transaction) => {
      const bookingDoc = await transaction.get(bookingRef);
      if (!bookingDoc.exists) throw new AppError('not-found', 'Booking not found');

      const data = bookingDoc.data() as Booking;
      const history = data.rejectionHistory || [];

      if (!history.includes(driverId)) {
        history.push(driverId);
      }

      transaction.update(bookingRef, {
        rejectionHistory: history,
        updatedAt: getIsoTimestamp(),
      });

      return { bookingId, rejected: true };
    });
  }
}
