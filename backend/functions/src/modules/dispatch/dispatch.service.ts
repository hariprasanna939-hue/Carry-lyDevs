import { DriverMatchingEngine } from './driverMatching';
import { JobAssignmentDispatcher } from './jobAssignment';
import { JobAcceptanceManager } from './jobAcceptance';
import { NearbyDriversFinder } from './nearbyDrivers';
import { BookingRepository } from '../bookings/booking.repository';
import { AppError } from '../../common/errors/AppError';
import { db } from '../../config/firebase';
import { COLLECTIONS } from '../../config/collections';
import { CONSTANTS } from '../../config/constants';

export class DispatchService {
  /**
   * 14. findAvailableDrivers — Find compatible nearby drivers
   */
  public static async findAvailableDrivers(lat: number, lon: number, radiusKm?: number) {
    return NearbyDriversFinder.findNearby(lat, lon, radiusKm);
  }

  public static async findNearbyDrivers(lat: number, lon: number, radiusKm?: number) {
    return this.findAvailableDrivers(lat, lon, radiusKm);
  }

  /**
   * 15. sendDriverJobOffers — Send job offers
   */
  public static async sendDriverJobOffers(bookingId: string, driverIds?: string[]) {
    const booking = await BookingRepository.getById(bookingId);
    if (!booking) throw new AppError('not-found', 'Booking not found');

    if (driverIds && driverIds.length > 0) {
      const offers = [];
      for (const dId of driverIds) {
        const offer = await JobAssignmentDispatcher.sendJobRequestToDriver(bookingId, dId);
        offers.push(offer);
      }
      return { offersSent: offers.length, offers };
    }

    return this.dispatchBookingToDrivers(bookingId);
  }

  public static async sendJobRequest(bookingId: string, driverId: string) {
    return JobAssignmentDispatcher.sendJobRequestToDriver(bookingId, driverId);
  }

  /**
   * 16. respondToJobOffer — Accept/reject an offer
   */
  public static async respondToJobOffer(driverId: string, offerId: string, action: 'accept' | 'reject') {
    const offerRef = db.collection(COLLECTIONS.DRIVER_JOB_OFFERS).doc(offerId);
    const offerDoc = await offerRef.get();

    if (!offerDoc.exists) {
      throw new AppError('not-found', 'Job offer not found or has expired');
    }

    const offerData = offerDoc.data();
    if (offerData?.driverId !== driverId) {
      throw new AppError('permission-denied', 'You are not the designated recipient of this job offer');
    }

    if (offerData?.status !== 'pending') {
      throw new AppError('failed-precondition', `Job offer is already ${offerData?.status}`);
    }

    const bookingId = offerData.bookingId;

    if (action === 'accept') {
      const result = await JobAcceptanceManager.acceptBookingAtomically(bookingId, driverId);
      await offerRef.update({ status: 'accepted' });
      return { offerId, action: 'accepted', result };
    } else {
      const result = await JobAcceptanceManager.rejectBooking(bookingId, driverId);
      await offerRef.update({ status: 'rejected' });
      // Re-dispatch to next candidate
      await this.dispatchBookingToDrivers(bookingId);
      return { offerId, action: 'rejected', result };
    }
  }

  /**
   * Match Vehicle Size
   */
  public static async matchVehicleSize(bookingId: string) {
    const booking = await BookingRepository.getById(bookingId);
    if (!booking) throw new AppError('not-found', 'Booking not found');

    const nearby = await NearbyDriversFinder.findNearby(
      booking.pickup.latitude,
      booking.pickup.longitude,
      CONSTANTS.MAX_SEARCH_RADIUS_KM
    );

    const matched = [];
    for (const item of nearby) {
      if (!item.driver.activeVehicleId) continue;
      const vehDoc = await db.collection(COLLECTIONS.VEHICLES).doc(item.driver.activeVehicleId).get();
      if (!vehDoc.exists) continue;

      const vehicleData = vehDoc.data();
      if (vehicleData?.vehicleType === booking.vehicleType || vehicleData?.vehicleSize === booking.vehicleType) {
        matched.push({
          ...item,
          vehicle: vehicleData,
        });
      }
    }

    return matched;
  }

  /**
   * Assign Driver (Atomic Transaction)
   */
  public static async assignDriver(bookingId: string, driverId: string) {
    return JobAcceptanceManager.acceptBookingAtomically(bookingId, driverId);
  }

  /**
   * Automated dispatch pipeline
   */
  public static async dispatchBookingToDrivers(bookingId: string) {
    const booking = await BookingRepository.getById(bookingId);
    if (!booking) throw new AppError('not-found', 'Booking not found');

    const matchedDrivers = await DriverMatchingEngine.matchDriversForBooking(booking);

    if (matchedDrivers.length === 0) {
      console.log(`[DispatchService] No nearby eligible drivers found for booking: ${bookingId}`);
      return { dispatched: false, candidateCount: 0 };
    }

    const target = matchedDrivers[0];
    const dispatchReq = await JobAssignmentDispatcher.sendJobRequestToDriver(bookingId, target.driver.userId);

    return {
      dispatched: true,
      candidateCount: matchedDrivers.length,
      assignedDriverId: target.driver.userId,
      dispatchRequestId: dispatchReq.id,
      offerId: dispatchReq.id,
    };
  }

  public static async acceptBooking(bookingId: string, driverId: string) {
    return this.assignDriver(bookingId, driverId);
  }

  public static async rejectBooking(bookingId: string, driverId: string) {
    const result = await JobAcceptanceManager.rejectBooking(bookingId, driverId);
    await this.dispatchBookingToDrivers(bookingId);
    return result;
  }
}
