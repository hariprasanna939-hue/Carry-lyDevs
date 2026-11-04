import { db } from '../../config/firebase';
import { COLLECTIONS } from '../../config/collections';
import { getIsoTimestamp } from '../../common/utils/timestamps';

export class TripLocationTracker {
  public static async recordDriverLocation(
    driverId: string,
    latitude: number,
    longitude: number,
    heading?: number,
    speed?: number
  ) {
    const now = getIsoTimestamp();
    const locationData = {
      driverId,
      latitude,
      longitude,
      heading: heading || 0,
      speed: speed || 0,
      updatedAt: now,
    };

    // Update in driver profile
    await db.collection(COLLECTIONS.DRIVER_PROFILES).doc(driverId).set(
      {
        currentLocation: {
          latitude,
          longitude,
          heading,
          speed,
          updatedAt: now,
        },
        updatedAt: now,
      },
      { merge: true }
    );

    // Also record in location history
    await db.collection(COLLECTIONS.DRIVER_LOCATIONS).add(locationData);

    return locationData;
  }
}
