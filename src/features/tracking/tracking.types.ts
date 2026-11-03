export interface DriverLocationUpdate {
  latitude: number;
  longitude: number;
  bookingId?: string | null;
  driverId?: string; // Backwards compatibility alias
  heading?: number;
  speed?: number;
  updatedAt: unknown;
}
