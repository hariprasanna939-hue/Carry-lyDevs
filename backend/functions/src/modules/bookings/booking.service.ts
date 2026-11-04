import { BookingRepository } from './booking.repository';
import { CreateBookingInput } from './booking.validation';
import { BookingPricingCalculator } from './booking.pricing';
import { BookingScheduler } from './booking.scheduling';
import { BookingCancellationService } from './booking.cancellation';
import { Booking } from '../../common/types/Booking';
import { generateId, generateOtp } from '../../common/utils/generateId';
import { getIsoTimestamp } from '../../common/utils/timestamps';
import { AppError } from '../../common/errors/AppError';

export class BookingService {
  /**
   * 1. Create Booking
   * Fully conforms to the official Firestore booking schema:
   * customerId, pickup, drop, vehicleSize, bookingType, helperCount, scheduledAt, fare, bookingStatus, paymentStatus, createdAt
   */
  public static async createBooking(customerId: string, input: CreateBookingInput): Promise<Booking> {
    const id = generateId('bk');
    const now = getIsoTimestamp();
    const pricing = BookingPricingCalculator.calculate(input);
    const isScheduled = BookingScheduler.isScheduled(input.scheduledAt);

    const booking: Booking & Record<string, unknown> = {
      id,
      customerId,
      vehicleType: input.vehicleType,
      vehicleSize: input.vehicleType,
      bookingType: isScheduled ? 'scheduled' : 'immediate',
      pickup: input.pickup,
      drop: input.drop,
      items: input.items,
      helperCount: input.helperCount || 0,
      scheduledAt: input.scheduledAt || now,
      isScheduled,
      distanceKm: pricing.distanceKm,
      estimatedDurationMinutes: pricing.durationMinutes,
      fare: pricing.breakdown,
      fareBreakdown: pricing.breakdown,
      totalFare: pricing.totalFare,
      status: isScheduled ? 'created' : 'searching',
      bookingStatus: isScheduled ? 'created' : 'searching',
      paymentStatus: 'pending',
      paymentMethod: input.paymentMethod || 'online',
      pickupOtp: generateOtp(4),
      dropOtp: generateOtp(4),
      createdAt: now,
      updatedAt: now,
    };

    await BookingRepository.create(booking);
    return booking;
  }

  /**
   * 2. Get Booking
   */
  public static async getBookingById(bookingId: string): Promise<Booking> {
    const booking = await BookingRepository.getById(bookingId);
    if (!booking) throw new AppError('not-found', 'Booking not found');
    return booking;
  }

  /**
   * 3. List Customer Bookings
   */
  public static async listCustomerBookings(customerId: string): Promise<Booking[]> {
    return BookingRepository.getCustomerBookings(customerId);
  }

  /**
   * 4. Reschedule Booking
   */
  public static async rescheduleBooking(customerId: string, bookingId: string, newScheduledAt: string) {
    const booking = await this.getBookingById(bookingId);

    if (booking.customerId !== customerId) {
      throw new AppError('permission-denied', 'You can only reschedule your own bookings');
    }

    if (booking.status !== 'created' && booking.status !== 'searching') {
      throw new AppError('failed-precondition', `Cannot reschedule booking in status "${booking.status}"`);
    }

    const scheduledDate = new Date(newScheduledAt);
    if (isNaN(scheduledDate.getTime()) || scheduledDate.getTime() < Date.now()) {
      throw new AppError('invalid-argument', 'Scheduled time must be a valid future timestamp');
    }

    const isScheduled = BookingScheduler.isScheduled(newScheduledAt);
    const updates = {
      scheduledAt: newScheduledAt,
      isScheduled,
      bookingType: isScheduled ? 'scheduled' : 'immediate',
      status: isScheduled ? ('created' as const) : ('searching' as const),
      bookingStatus: isScheduled ? 'created' : 'searching',
      updatedAt: getIsoTimestamp(),
    };

    await BookingRepository.update(bookingId, updates);
    return { ...booking, ...updates };
  }

  /**
   * 5. Cancel Booking
   */
  public static async cancelBooking(bookingId: string, userId: string, reason?: string) {
    const booking = await this.getBookingById(bookingId);
    const cancelledBy = booking.customerId === userId ? 'customer' : booking.driverId === userId ? 'driver' : 'admin';
    return BookingCancellationService.cancelBooking(bookingId, cancelledBy, reason);
  }
}
