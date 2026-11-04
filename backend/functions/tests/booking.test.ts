import { validateStatusTransition } from '../src/modules/bookings/booking.lifecycle';

describe('Booking Lifecycle Transitions', () => {
  it('should allow valid transition from searching to accepted', () => {
    expect(() => validateStatusTransition('searching', 'accepted')).not.toThrow();
  });

  it('should reject illegal transition from created directly to completed', () => {
    expect(() => validateStatusTransition('created', 'completed')).toThrow();
  });
});
