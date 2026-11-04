import { isNonEmptyString, isValidPhoneNumber } from '../../common/validators';
import { UpdateProfileInput, SwitchPortalInput } from './user.types';

export function validateUpdateProfileInput(data: unknown): {
  isValid: boolean;
  errors?: string[];
  value?: UpdateProfileInput;
} {
  const d = data as Record<string, unknown> | null;
  const errors: string[] = [];
  if (!d) return { isValid: false, errors: ['Request body cannot be empty'] };

  const value: UpdateProfileInput = {};
  if (d.name !== undefined) {
    if (!isNonEmptyString(d.name)) errors.push('Name cannot be empty');
    else value.name = d.name.trim();
  }
  if (d.phone !== undefined) {
    if (!isValidPhoneNumber(d.phone)) errors.push('Invalid phone number');
    else value.phone = d.phone.trim();
  }
  if (d.photoURL !== undefined && typeof d.photoURL === 'string') {
    value.photoURL = d.photoURL.trim();
  }

  return { isValid: errors.length === 0, errors: errors.length > 0 ? errors : undefined, value };
}

export function validateSwitchPortalInput(data: unknown): {
  isValid: boolean;
  errors?: string[];
  value?: SwitchPortalInput;
} {
  const d = data as Record<string, unknown> | null;
  if (!d || (d.portal !== 'customer' && d.portal !== 'driver')) {
    return { isValid: false, errors: ['Portal must be either "customer" or "driver"'] };
  }
  return { isValid: true, value: { portal: d.portal } };
}
