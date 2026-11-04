import { isNonEmptyString, isValidPhoneNumber } from '../../common/validators';
import { SubmitDriverApplicationInput, UpdateAvailabilityInput } from './driver.types';

export function validateDriverApplication(data: unknown): {
  isValid: boolean;
  errors?: string[];
  value?: SubmitDriverApplicationInput;
} {
  const d = data as Record<string, unknown> | null;
  const errors: string[] = [];
  if (!d) return { isValid: false, errors: ['Application data cannot be empty'] };

  if (!isNonEmptyString(d.fullName)) errors.push('Full name is required');
  if (!isValidPhoneNumber(d.phone)) errors.push('Valid phone number is required');
  if (!isNonEmptyString(d.vehicleType)) errors.push('Vehicle type is required');
  if (!isNonEmptyString(d.vehicleRegistrationNumber)) errors.push('Vehicle registration number is required');

  if (!Array.isArray(d.documents) || d.documents.length === 0) {
    errors.push('At least one identity or vehicle document must be submitted');
  }

  if (errors.length > 0) return { isValid: false, errors };

  return {
    isValid: true,
    value: {
      fullName: (d.fullName as string).trim(),
      phone: (d.phone as string).trim(),
      serviceAreas: Array.isArray(d.serviceAreas) ? (d.serviceAreas as string[]) : ['Coimbatore'],
      vehicleType: (d.vehicleType as string).trim(),
      vehicleRegistrationNumber: (d.vehicleRegistrationNumber as string).trim().toUpperCase(),
      capacityKg: typeof d.capacityKg === 'number' ? d.capacityKg : 500,
      documents: d.documents as SubmitDriverApplicationInput['documents'],
    },
  };
}

export function validateAvailabilityInput(data: unknown): {
  isValid: boolean;
  errors?: string[];
  value?: UpdateAvailabilityInput;
} {
  const d = data as Record<string, unknown> | null;
  if (!d || typeof d.onlineStatus !== 'boolean') {
    return { isValid: false, errors: ['onlineStatus must be a boolean'] };
  }
  return {
    isValid: true,
    value: {
      onlineStatus: d.onlineStatus,
      latitude: typeof d.latitude === 'number' ? d.latitude : undefined,
      longitude: typeof d.longitude === 'number' ? d.longitude : undefined,
    },
  };
}
