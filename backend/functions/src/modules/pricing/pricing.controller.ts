import { onCall } from 'firebase-functions/v2/https';
import { assertAuthenticated } from '../../common/middleware/authenticate';
import { validateRequest } from '../../common/middleware/validateRequest';
import { validateFareCalculationRequest } from './pricing.validation';
import { PricingService } from './pricing.service';
import { handleError } from '../../common/errors/errorHandler';
import { createSuccessResponse } from '../../common/types/ApiResponse';
import { VehicleType } from '../../common/types/Booking';

export const calculateFare = onCall(async (request) => {
  try {
    assertAuthenticated(request);
    const input = validateRequest(request.data, validateFareCalculationRequest);
    const estimate = PricingService.calculateFareEstimate(input);
    return createSuccessResponse(estimate);
  } catch (error) {
    return handleError(error, 'calculateFare');
  }
});

export const getVehicleRateDetails = onCall((request) => {
  try {
    const vehicleType = (request.data as { vehicleType?: VehicleType })?.vehicleType;
    if (!vehicleType) throw new Error('vehicleType is required');
    const rate = PricingService.getVehicleRate(vehicleType);
    return createSuccessResponse(rate);
  } catch (error) {
    return handleError(error, 'getVehicleRateDetails');
  }
});

export const calculateDistanceCharge = onCall((request) => {
  try {
    const d = request.data as { vehicleType?: VehicleType; distanceKm?: number };
    if (!d?.vehicleType || typeof d?.distanceKm !== 'number') {
      throw new Error('vehicleType and distanceKm are required');
    }
    const result = PricingService.calculateDistanceCharge(d.vehicleType, d.distanceKm);
    return createSuccessResponse(result);
  } catch (error) {
    return handleError(error, 'calculateDistanceCharge');
  }
});

export const calculateHelperCharge = onCall((request) => {
  try {
    const helperCount = Number((request.data as { helperCount?: number })?.helperCount) || 0;
    const result = PricingService.calculateHelperCharge(helperCount);
    return createSuccessResponse(result);
  } catch (error) {
    return handleError(error, 'calculateHelperCharge');
  }
});

export const calculateAdditionalCharges = onCall((request) => {
  try {
    const d = request.data as { tollCharges?: number; isNight?: boolean; waitingMinutes?: number } || {};
    const result = PricingService.calculateAdditionalCharges(d);
    return createSuccessResponse(result);
  } catch (error) {
    return handleError(error, 'calculateAdditionalCharges');
  }
});
