import { validateRegisterInput } from '../src/modules/auth/auth.validation';

describe('Auth Module Validation', () => {
  it('should validate complete valid registration data', () => {
    const input = {
      name: 'Ravi Kumar',
      phone: '+919876543210',
      email: 'ravi@example.com',
      role: 'customer',
    };
    const result = validateRegisterInput(input);
    expect(result.isValid).toBe(true);
    expect(result.value?.name).toBe('Ravi Kumar');
  });

  it('should reject missing phone or email', () => {
    const input = {
      name: 'Ravi Kumar',
      email: 'invalid-email',
    };
    const result = validateRegisterInput(input);
    expect(result.isValid).toBe(false);
  });
});
