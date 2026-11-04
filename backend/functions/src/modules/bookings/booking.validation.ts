import { isNonEmptyString, isValidCoordinate, isPositiveNumber } from '../../common/validators';
import { VehicleType, PaymentMethod, LocationPoint, CargoItem } from '../../common/types/Booking';

export interface CreateBookingInput {
  vehicleType: VehicleType;
  pickup: LocationPoint;
  drop: LocationPoint;
  items: CargoItem[];
  helperCount?: number;
  paymentMethod?: PaymentMethod;
  scheduledAt?: string;
}

export function validateCreateBookingInput(data: unknown): {
  isValid: boolean;
  errors?: string[];
  value?: CreateBookingInput;
} {
  const d = data as Record<string, unknown> | null;
  const errors: string[] = [];

  if (!d) return { isValid: false, errors: ['Booking request cannot be empty'] };
  if (!isNonEmptyString(d.vehicleType)) errors.push('vehicleType is required');

  const pickup = d.pickup as Record<string, unknown> | undefined;
  const drop = d.drop as Record<string, unknown> | undefined;

  if (!pickup || !isNonEmptyString(pickup.address) || !isValidCoordinate(pickup.latitude, pickup.longitude)) {
    errors.push('Valid pickup address and coordinates are required');
  }
  if (!drop || !isNonEmptyString(drop.address) || !isValidCoordinate(drop.latitude, drop.longitude)) {
    errors.push('Valid drop address and coordinates are required');
  }

  if (!Array.isArray(d.items) || d.items.length === 0) {
    errors.push('At least one item must be specified in the booking');
  }

  if (errors.length > 0) return { isValid: false, errors };

  return {
    isValid: true,
    value: {
      vehicleType: d.vehicleType as VehicleType,
      pickup: pickup as unknown as LocationPoint,
      drop: drop as unknown as LocationPoint,
      items: d.items as CargoItem[],
      helperCount: typeof d.helperCount === 'number' && isPositiveNumber(d.helperCount) ? d.helperCount : 0,
      paymentMethod: (d.paymentMethod as PaymentMethod) || 'online',
      scheduledAt: typeof d.scheduledAt === 'string' ? d.scheduledAt : undefined,
    },
  };
}
