import { TripStatusManager } from './trip.status';
import { TripLocationTracker } from './trip.location';
import { BookingStatus } from '../../common/types/Booking';
import { JobAcceptanceManager } from '../dispatch/jobAcceptance';
import { BookingRepository } from '../bookings/booking.repository';
import { getIsoTimestamp } from '../../common/utils/timestamps';

export class TripService {
  /**
   * 1. Accept Job
   */
  public static async acceptJob(bookingId: string, driverId: string) {
    return JobAcceptanceManager.acceptBookingAtomically(bookingId, driverId);
  }

  /**
   * 2. Start Trip (Cargo In Transit)
   */
  public static async startTrip(bookingId: string, driverId: string) {
    return TripStatusManager.updateStatus(bookingId, driverId, 'in_transit');
  }

  /**
   * 3. Update Location
   */
  public static async updateDriverLocation(
    driverId: string,
    latitude: number,
    longitude: number,
    heading?: number,
    speed?: number
  ) {
    return TripLocationTracker.recordDriverLocation(driverId, latitude, longitude, heading, speed);
  }

  /**
   * 4. Mark Pickup (Arrived / Loading with OTP verification)
   */
  public static async markPickup(bookingId: string, driverId: string, otp?: string) {
    // If status is accepted -> arrived_at_pickup, then -> loading with OTP
    const booking = await BookingRepository.getById(bookingId);
    if (!booking) throw new Error('Booking not found');

    if (booking.status === 'accepted') {
      await TripStatusManager.updateStatus(bookingId, driverId, 'arrived_at_pickup');
    }

    return TripStatusManager.updateStatus(bookingId, driverId, 'loading', otp);
  }

  /**
   * 5. Complete Trip (Delivery proof & Drop OTP verification)
   */
  public static async completeTrip(
    bookingId: string,
    driverId: string,
    otp?: string,
    deliveryProofUrl?: string
  ) {
    if (deliveryProofUrl) {
      await BookingRepository.update(bookingId, {
        deliveryProofUrl,
        updatedAt: getIsoTimestamp(),
      } as Record<string, unknown>);
    }

    return TripStatusManager.updateStatus(bookingId, driverId, 'completed', otp);
  }

  /**
   * Generic Status Transition
   */
  public static async updateTripStatus(
    bookingId: string,
    driverId: string,
    status: BookingStatus,
    otp?: string
  ) {
    return TripStatusManager.updateStatus(bookingId, driverId, status, otp);
  }
}
