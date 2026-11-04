import { AppError } from '../errors/AppError';

export type ValidatorFn<T> = (data: unknown) => { isValid: boolean; errors?: string[]; value?: T };

export function validateRequest<T>(data: unknown, validator: ValidatorFn<T>): T {
  const result = validator(data);
  if (!result.isValid || !result.value) {
    const errorDetails = result.errors?.join(', ') || 'Invalid payload';
    throw new AppError('invalid-argument', `Validation failed: ${errorDetails}`, result.errors);
  }
  return result.value;
}
