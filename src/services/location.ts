export interface GeoCoordinates {
  latitude: number;
  longitude: number;
}

export const locationService = {
  async getCurrentPosition(): Promise<GeoCoordinates> {
    // In production, uses expo-location or navigator.geolocation
    return new Promise((resolve) => {
      if (typeof navigator !== "undefined" && navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            resolve({
              latitude: pos.coords.latitude,
              longitude: pos.coords.longitude,
            });
          },
          () => {
            // Default to Coimbatore center on permission denial / fallback
            resolve({ latitude: 11.0168, longitude: 76.9558 });
          }
        );
      } else {
        // Coimbatore fallback
        resolve({ latitude: 11.0168, longitude: 76.9558 });
      }
    });
  },

  calculateDistanceKm(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c * 10) / 10;
  },
};
