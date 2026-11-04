import { isNonEmptyString, isValidCoordinate } from '../../common/validators';

export interface SaveAddressInput {
  label: string; // e.g., "Home", "Warehouse", "Shop"
  address: string;
  landmark?: string;
  latitude: number;
  longitude: number;
  contactName?: string;
  contactPhone?: string;
}

export function validateSaveAddressInput(data: unknown): {
  isValid: boolean;
  errors?: string[];
  value?: SaveAddressInput;
} {
  const d = data as Record<string, unknown> | null;
  const errors: string[] = [];

  if (!d) return { isValid: false, errors: ['Body is required'] };
  if (!isNonEmptyString(d.label)) errors.push('label is required');
  if (!isNonEmptyString(d.address)) errors.push('address is required');
  if (typeof d.latitude !== 'number' || typeof d.longitude !== 'number' || !isValidCoordinate(d.latitude, d.longitude)) {
    errors.push('Valid latitude and longitude are required');
  }

  if (errors.length > 0) return { isValid: false, errors };

  return {
    isValid: true,
    value: {
      label: (d.label as string).trim(),
      address: (d.address as string).trim(),
      landmark: typeof d.landmark === 'string' ? d.landmark.trim() : undefined,
      latitude: d.latitude as number,
      longitude: d.longitude as number,
      contactName: typeof d.contactName === 'string' ? d.contactName.trim() : undefined,
      contactPhone: typeof d.contactPhone === 'string' ? d.contactPhone.trim() : undefined,
    },
  };
}
