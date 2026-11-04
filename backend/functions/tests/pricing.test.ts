import { computeFare } from '../src/modules/pricing/fareCalculator';

describe('Pricing Module Calculations', () => {
  it('should calculate base fare and distance charges correctly for Tata Ace', () => {
    const fare = computeFare({
      vehicleType: 'tata_ace',
      distanceKm: 10,
      durationMinutes: 30,
      helperCount: 1,
    });

    // Base fare: 220, baseKm: 2, billableKm: 8 * 25 = 200
    // Time fare: 30 * 2 = 60
    // Helper: 150
    // Subtotal: 220 + 200 + 60 + 150 = 630
    // GST (5%): ~32
    // Total: ~662
    expect(fare.baseFare).toBe(220);
    expect(fare.distanceFare).toBe(200);
    expect(fare.helperFee).toBe(150);
    expect(fare.total).toBeGreaterThan(600);
  });
});
