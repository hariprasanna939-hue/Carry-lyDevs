import { BookingRepository } from './booking.repository';
import { AppError } from '../../common/errors/AppError';
import { getIsoTimestamp } from '../../common/utils/timestamps';

export class BookingCancellationService {
  public static async cancelBooking(
    bookingId: string,
    cancelledBy: 'customer' | 'driver' | 'admin' | 'system',
    reason?: string
  ) {
    const booking = await BookingRepository.getById(bookingId);
    if (!booking) throw new AppError('not-found', 'Booking not found');

    if (booking.status === 'completed' || booking.status === 'cancelled') {
      throw new AppError('failed-precondition', `Booking is already ${booking.status}`);
    }

    if (booking.status === 'in_transit' && cancelledBy === 'customer') {
      throw new AppError('failed-precondition', 'Cannot cancel a booking that is currently in transit');
    }

    const updates = {
      status: 'cancelled' as const,
      cancelledBy,
      cancellationReason: reason || 'Cancelled by user',
      updatedAt: getIsoTimestamp(),
    };

    await BookingRepository.update(bookingId, updates);
    return { ...booking, ...updates };
  }
}
