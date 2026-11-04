import { PricingService } from '../pricing/pricing.service';
import { CreateBookingInput } from './booking.validation';

export class BookingPricingCalculator {
  public static calculate(input: CreateBookingInput) {
    return PricingService.calculateFareEstimate({
      vehicleType: input.vehicleType,
      pickup: { latitude: input.pickup.latitude, longitude: input.pickup.longitude },
      drop: { latitude: input.drop.latitude, longitude: input.drop.longitude },
      helperCount: input.helperCount,
    });
  }
}
