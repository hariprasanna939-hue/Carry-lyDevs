import { isPositiveNumber } from '../../common/validators';
import { VehicleType } from '../../common/types/Booking';

export interface CalculateFareRequest {
  vehicleType: VehicleType;
  pickup: { latitude: number; longitude: number };
  drop: { latitude: number; longitude: number };
  helperCount?: number;
}

export function validateFareCalculationRequest(data: unknown): {
  isValid: boolean;
  errors?: string[];
  value?: CalculateFareRequest;
} {
  const d = data as Record<string, unknown> | null;
  const errors: string[] = [];

  if (!d) return { isValid: false, errors: ['Request body cannot be empty'] };
  if (!d.vehicleType || typeof d.vehicleType !== 'string') errors.push('Valid vehicleType is required');

  const pickup = d.pickup as Record<string, unknown> | undefined;
  const drop = d.drop as Record<string, unknown> | undefined;

  if (!pickup || typeof pickup.latitude !== 'number' || typeof pickup.longitude !== 'number') {
    errors.push('Valid pickup latitude and longitude are required');
  }
  if (!drop || typeof drop.latitude !== 'number' || typeof drop.longitude !== 'number') {
    errors.push('Valid drop latitude and longitude are required');
  }

  if (d.helperCount !== undefined && (!isPositiveNumber(d.helperCount) || (d.helperCount as number) > 5)) {
    errors.push('helperCount must be between 0 and 5');
  }

  if (errors.length > 0) return { isValid: false, errors };

  return {
    isValid: true,
    value: {
      vehicleType: d.vehicleType as VehicleType,
      pickup: { latitude: pickup!.latitude as number, longitude: pickup!.longitude as number },
      drop: { latitude: drop!.latitude as number, longitude: drop!.longitude as number },
      helperCount: typeof d.helperCount === 'number' ? d.helperCount : 0,
    },
  };
}
