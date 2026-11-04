import { VehicleType, FareBreakdown } from '../../common/types/Booking';
import { getVehicleRate } from './vehicleRates';
import { calculateHelperFee } from './helperCharges';
import { CONSTANTS } from '../../config/constants';

export interface FareCalculationInput {
  vehicleType: VehicleType;
  distanceKm: number;
  durationMinutes: number;
  helperCount?: number;
  promoDiscount?: number;
}

export function computeFare(input: FareCalculationInput): FareBreakdown {
  const rate = getVehicleRate(input.vehicleType);
  const baseFare = rate.baseFare;

  const billableKm = Math.max(0, input.distanceKm - rate.baseKm);
  const distanceFare = Math.round(billableKm * rate.perKmRate);

  const timeFare = Math.round(input.durationMinutes * rate.perMinuteRate);
  const helperFee = calculateHelperFee(input.helperCount || 0);

  const subtotal = baseFare + distanceFare + timeFare + helperFee;
  const tax = Math.round(subtotal * CONSTANTS.GST_PERCENTAGE);
  const discount = Math.min(input.promoDiscount || 0, subtotal);
  const total = Math.max(0, subtotal + tax - discount);

  return {
    baseFare,
    distanceFare,
    timeFare,
    helperFee,
    tax,
    discount,
    total,
  };
}
