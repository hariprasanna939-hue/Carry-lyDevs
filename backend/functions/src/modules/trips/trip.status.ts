import { BookingStatus } from '../../common/types/Booking';
import { validateStatusTransition } from '../bookings/booking.lifecycle';
import { BookingRepository } from '../bookings/booking.repository';
import { AppError } from '../../common/errors/AppError';
import { getIsoTimestamp } from '../../common/utils/timestamps';
import { db } from '../../config/firebase';
import { COLLECTIONS } from '../../config/collections';
import { generateId } from '../../common/utils/generateId';

export class TripStatusManager {
  public static async updateStatus(
    bookingId: string,
    driverId: string,
    nextStatus: BookingStatus,
    otp?: string
  ) {
    const booking = await BookingRepository.getById(bookingId);
    if (!booking) throw new AppError('not-found', 'Booking not found');

    if (booking.driverId !== driverId) {
      throw new AppError('permission-denied', 'Only the assigned driver can update trip status');
    }

    validateStatusTransition(booking.status, nextStatus);

    // Verify OTP on loading (pickup verification)
    if (nextStatus === 'loading' && booking.pickupOtp && otp !== booking.pickupOtp) {
      throw new AppError('invalid-argument', 'Invalid Pickup OTP verification code');
    }

    // Verify OTP on completion (delivery verification)
    if (nextStatus === 'completed' && booking.dropOtp && otp !== booking.dropOtp) {
      throw new AppError('invalid-argument', 'Invalid Delivery OTP verification code');
    }

    const now = getIsoTimestamp();
    const updates: Record<string, unknown> = {
      status: nextStatus,
      bookingStatus: nextStatus,
      updatedAt: now,
    };

    if (nextStatus === 'completed') {
      updates.completedAt = now;
      updates.paymentStatus = 'paid';

      // 1. Create driverEarnings/{earningId} record
      const earningId = generateId('earn');
      const gross = booking.totalFare;
      const commission = Math.round(gross * 0.15); // 15% platform fee
      const net = gross - commission;

      await db.collection(COLLECTIONS.DRIVER_EARNINGS).doc(earningId).set({
        driverId,
        bookingId,
        grossAmount: gross,
        commission,
        netAmount: net,
        status: 'credited',
        createdAt: now,
      });

      // 2. Increment completedTrips and totalEarnings in drivers/{driverId}
      const driverRef = db.collection(COLLECTIONS.DRIVERS).doc(driverId);
      const driverDoc = await driverRef.get();
      if (driverDoc.exists) {
        const dData = driverDoc.data();
        const tripsCount = (dData?.completedTrips || 0) + 1;
        const earnings = (dData?.totalEarningsPaise || 0) + net * 100;
        await driverRef.set(
          {
            completedTrips: tripsCount,
            totalEarningsPaise: earnings,
            updatedAt: now,
          },
          { merge: true }
        );
      }
    }

    await BookingRepository.update(bookingId, updates);

    // Sync to dedicated trips/{bookingId} collection
    await db.collection(COLLECTIONS.TRIPS).doc(bookingId).set(
      {
        bookingId,
        customerId: booking.customerId,
        driverId,
        tripStatus: nextStatus,
        startedAt: nextStatus === 'in_transit' ? now : undefined,
        completedAt: nextStatus === 'completed' ? now : undefined,
        updatedAt: now,
      },
      { merge: true }
    );

    return { bookingId, status: nextStatus, updatedAt: now };
  }
}
