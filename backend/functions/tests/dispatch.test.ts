import { calculateDistanceKm } from '../src/common/utils/geolocation';

describe('Dispatch Geolocation Engine', () => {
  it('should accurately calculate distance between Gandhipuram and RS Puram', () => {
    // Gandhipuram ~ (11.0168, 76.9558)
    // RS Puram ~ (11.0088, 76.9458)
    const distance = calculateDistanceKm(11.0168, 76.9558, 11.0088, 76.9458);
    expect(distance).toBeGreaterThan(1);
    expect(distance).toBeLessThan(3);
  });
});
