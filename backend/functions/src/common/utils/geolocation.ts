/**
 * Haversine formula to calculate great-circle distance between two coordinates in kilometers.
 */
export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth radius in kilometers
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return Math.round(distance * 100) / 100;
}

function toRad(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

/**
 * Estimate road trip duration in minutes given straight-line distance in km.
 * Assumes average speed of 25 km/h in Coimbatore city traffic + 5 min buffer.
 */
export function estimateTripMinutes(distanceKm: number): number {
  const avgSpeedKmH = 25;
  const minutes = (distanceKm / avgSpeedKmH) * 60 + 5;
  return Math.max(Math.round(minutes), 10);
}
