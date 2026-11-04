import { isValidEmail, isValidPhoneNumber, isNonEmptyString } from '../../common/validators';

export interface RegisterInput {
  name: string;
  phone: string;
  email: string;
  role?: 'customer' | 'driver';
}

export function validateRegisterInput(data: unknown): { isValid: boolean; errors?: string[]; value?: RegisterInput } {
  const d = data as Record<string, unknown> | null;
  const errors: string[] = [];

  if (!d) return { isValid: false, errors: ['Request body cannot be empty'] };
  if (!isNonEmptyString(d.name)) errors.push('Name is required');
  if (!isValidPhoneNumber(d.phone)) errors.push('Valid Indian phone number is required');
  if (!isValidEmail(d.email)) errors.push('Valid email address is required');

  if (errors.length > 0) return { isValid: false, errors };

  return {
    isValid: true,
    value: {
      name: (d.name as string).trim(),
      phone: (d.phone as string).trim(),
      email: (d.email as string).trim().toLowerCase(),
      role: (d.role as 'customer' | 'driver') || 'customer',
    },
  };
}
