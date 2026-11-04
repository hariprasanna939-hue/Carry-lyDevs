import { CONSTANTS } from '../../config/constants';
import { VehicleType } from '../../common/types/Booking';

export interface VehicleRate {
  baseFare: number;
  baseKm: number;
  perKmRate: number;
  perMinuteRate: number;
  capacityKg: number;
}

export function getVehicleRate(type: VehicleType): VehicleRate {
  const rate = CONSTANTS.DEFAULT_RATES[type];
  if (!rate) {
    return CONSTANTS.DEFAULT_RATES.two_wheeler;
  }
  return rate;
}
