import { NearbyDriversFinder, DriverWithDistance } from './nearbyDrivers';
import { Booking } from '../../common/types/Booking';
import { db } from '../../config/firebase';
import { COLLECTIONS } from '../../config/collections';

export class DriverMatchingEngine {
  public static async matchDriversForBooking(
    booking: Booking,
    maxCandidates = 5
  ): Promise<DriverWithDistance[]> {
    const nearby = await NearbyDriversFinder.findNearby(
      booking.pickup.latitude,
      booking.pickup.longitude
    );

    const eligible: DriverWithDistance[] = [];

    for (const item of nearby) {
      // Check if driver has already rejected this booking
      if (booking.rejectionHistory && booking.rejectionHistory.includes(item.driver.userId)) {
        continue;
      }

      // Check if driver is already engaged in an active booking
      const activeTripsSnap = await db
        .collection(COLLECTIONS.BOOKINGS)
        .where('driverId', '==', item.driver.userId)
        .where('status', 'in', ['accepted', 'arrived_at_pickup', 'loading', 'in_transit', 'arrived_at_drop', 'unloading'])
        .limit(1)
        .get();

      if (!activeTripsSnap.empty) {
        continue; // Driver is busy
      }

      eligible.push(item);
      if (eligible.length >= maxCandidates) break;
    }

    return eligible;
  }
}
