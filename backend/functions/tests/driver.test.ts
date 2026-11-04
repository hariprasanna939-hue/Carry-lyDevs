import { validateDriverApplication } from '../src/modules/drivers/driver.validation';

describe('Driver Module Validation', () => {
  it('should validate driver application data', () => {
    const input = {
      fullName: 'Suresh Raina',
      phone: '9876543210',
      vehicleType: 'tata_ace',
      vehicleRegistrationNumber: 'TN38AB1234',
      documents: [
        { type: 'driving_license', frontUrl: 'https://storage/dl.jpg' },
      ],
    };

    const result = validateDriverApplication(input);
    expect(result.isValid).toBe(true);
    expect(result.value?.vehicleRegistrationNumber).toBe('TN38AB1234');
  });
});
