import { DriverRepository } from '../drivers/driver.repository';
import { calculateDistanceKm } from '../../common/utils/geolocation';
import { DriverProfile } from '../../common/types/Driver';
import { CONSTANTS } from '../../config/constants';

export interface DriverWithDistance {
  driver: DriverProfile;
  distanceKm: number;
}

export class NearbyDriversFinder {
  public static async findNearby(
    lat: number,
    lon: number,
    maxRadiusKm = CONSTANTS.DEFAULT_SEARCH_RADIUS_KM
  ): Promise<DriverWithDistance[]> {
    const allOnlineDrivers = await DriverRepository.getActiveOnlineDrivers();

    const candidates: DriverWithDistance[] = [];

    for (const driver of allOnlineDrivers) {
      if (!driver.currentLocation) continue;

      const distance = calculateDistanceKm(
        lat,
        lon,
        driver.currentLocation.latitude,
        driver.currentLocation.longitude
      );

      if (distance <= maxRadiusKm) {
        candidates.push({ driver, distanceKm: distance });
      }
    }

    return candidates.sort((a, b) => a.distanceKm - b.distanceKm);
  }
}
