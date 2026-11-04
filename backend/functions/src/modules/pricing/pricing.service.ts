import { CalculateFareRequest } from './pricing.validation';
import { computeFare } from './fareCalculator';
import { getVehicleRate, VehicleRate } from './vehicleRates';
import { calculateHelperFee } from './helperCharges';
import { calculateDistanceKm, estimateTripMinutes } from '../../common/utils/geolocation';
import { FareBreakdown, VehicleType } from '../../common/types/Booking';

export interface FareEstimateResult {
  distanceKm: number;
  durationMinutes: number;
  breakdown: FareBreakdown;
  totalFare: number;
}

export interface AdditionalChargesResult {
  tollCharges: number;
  nightSurcharge: number;
  waitingCharges: number;
  totalAdditional: number;
}

export class PricingService {
  /**
   * 1. Calculate Complete Fare
   */
  public static calculateFareEstimate(request: CalculateFareRequest): FareEstimateResult {
    const distanceKm = calculateDistanceKm(
      request.pickup.latitude,
      request.pickup.longitude,
      request.drop.latitude,
      request.drop.longitude
    );

    const durationMinutes = estimateTripMinutes(distanceKm);

    const breakdown = computeFare({
      vehicleType: request.vehicleType,
      distanceKm,
      durationMinutes,
      helperCount: request.helperCount || 0,
    });

    return {
      distanceKm,
      durationMinutes,
      breakdown,
      totalFare: breakdown.total,
    };
  }

  /**
   * 2. Vehicle Rate
   */
  public static getVehicleRate(vehicleType: VehicleType): VehicleRate {
    return getVehicleRate(vehicleType);
  }

  /**
   * 3. Distance Charge
   */
  public static calculateDistanceCharge(vehicleType: VehicleType, distanceKm: number) {
    const rate = getVehicleRate(vehicleType);
    const billableKm = Math.max(0, distanceKm - rate.baseKm);
    const charge = Math.round(billableKm * rate.perKmRate);
    return {
      vehicleType,
      distanceKm,
      baseKm: rate.baseKm,
      perKmRate: rate.perKmRate,
      billableKm,
      distanceCharge: charge,
    };
  }

  /**
   * 4. Helper Charge
   */
  public static calculateHelperCharge(helperCount: number) {
    const charge = calculateHelperFee(helperCount);
    return {
      helperCount,
      helperFee: charge,
    };
  }

  /**
   * 5. Additional Charges (Toll, Night Surcharge 11PM-5AM, Waiting fee)
   */
  public static calculateAdditionalCharges(params: {
    tollCharges?: number;
    isNight?: boolean;
    waitingMinutes?: number;
  }): AdditionalChargesResult {
    const tollCharges = Math.max(0, params.tollCharges || 0);
    const nightSurcharge = params.isNight ? 50 : 0; // Flat ₹50 night surcharge in Coimbatore
    const waitingCharges = Math.max(0, Math.round(((params.waitingMinutes || 0) / 10) * 20)); // ₹20 per 10 min

    return {
      tollCharges,
      nightSurcharge,
      waitingCharges,
      totalAdditional: tollCharges + nightSurcharge + waitingCharges,
    };
  }
}
