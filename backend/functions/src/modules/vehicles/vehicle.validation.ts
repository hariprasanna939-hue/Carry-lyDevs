import { isNonEmptyString } from '../../common/validators';
import { RegisterVehicleInput } from './vehicle.types';

export function validateRegisterVehicle(data: unknown): {
  isValid: boolean;
  errors?: string[];
  value?: RegisterVehicleInput;
} {
  const d = data as Record<string, unknown> | null;
  const errors: string[] = [];
  if (!d) return { isValid: false, errors: ['Body is required'] };

  if (!isNonEmptyString(d.vehicleType)) errors.push('Vehicle type is required');
  if (!isNonEmptyString(d.registrationNumber)) errors.push('Registration number is required');

  if (errors.length > 0) return { isValid: false, errors };

  return {
    isValid: true,
    value: {
      vehicleType: (d.vehicleType as string).trim(),
      registrationNumber: (d.registrationNumber as string).trim().toUpperCase(),
      capacityKg: typeof d.capacityKg === 'number' ? d.capacityKg : 500,
      vehiclePhotos: Array.isArray(d.vehiclePhotos) ? (d.vehiclePhotos as string[]) : [],
    },
  };
}
