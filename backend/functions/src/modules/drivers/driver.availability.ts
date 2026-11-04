import { DriverRepository } from './driver.repository';
import { getIsoTimestamp } from '../../common/utils/timestamps';
import { AppError } from '../../common/errors/AppError';

export class DriverAvailabilityManager {
  public static async setOnlineStatus(
    driverId: string,
    onlineStatus: boolean,
    location?: { latitude: number; longitude: number }
  ) {
    const driver = await DriverRepository.getById(driverId);
    if (!driver) throw new AppError('not-found', 'Driver profile not found');

    if (onlineStatus && driver.verificationStatus !== 'approved') {
      throw new AppError('failed-precondition', 'Only verified drivers can go online');
    }

    const updates: Record<string, unknown> = {
      onlineStatus,
      updatedAt: getIsoTimestamp(),
    };

    if (location) {
      updates.currentLocation = {
        latitude: location.latitude,
        longitude: location.longitude,
        updatedAt: getIsoTimestamp(),
      };
    }

    await DriverRepository.update(driverId, updates);
    return { onlineStatus, currentLocation: updates.currentLocation };
  }
}
