import { LocationPoint } from "../types/booking";

export interface RouteInfo {
  distanceKm: number;
  durationMinutes: number;
  polyline: string;
}

export const mapsService = {
  async getRouteEstimate(origin: LocationPoint, destination: LocationPoint): Promise<RouteInfo> {
    // Computes distance and duration between pickup and dropoff
    const R = 6371;
    const dLat = ((destination.latitude - origin.latitude) * Math.PI) / 180;
    const dLon = ((destination.longitude - origin.longitude) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((origin.latitude * Math.PI) / 180) *
        Math.cos((destination.latitude * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const straightDist = R * c;

    // Road factor approximation (~1.3x straight distance in city)
    const distanceKm = Math.max(1, Math.round(straightDist * 1.3 * 10) / 10);
    const averageCitySpeedKmph = 25;
    const durationMinutes = Math.max(10, Math.round((distanceKm / averageCitySpeedKmph) * 60));

    return {
      distanceKm,
      durationMinutes,
      polyline: "",
    };
  },

  async searchAddress(queryText: string): Promise<Array<{ description: string; placeId: string }>> {
    if (!queryText.trim()) return [];
    // Common Coimbatore locations mock / local quick lookup
    const places = [
      { description: "Gandhipuram Central Bus Stand, Coimbatore", placeId: "cbe_1" },
      { description: "RS Puram D.B. Road, Coimbatore", placeId: "cbe_2" },
      { description: "Tidel Park, Peelamedu, Coimbatore", placeId: "cbe_3" },
      { description: "Saravanampatti IT Corridor, Coimbatore", placeId: "cbe_4" },
      { description: "Ukkadam Market, Coimbatore", placeId: "cbe_5" },
      { description: "SIDCO Industrial Estate, Kurichi, Coimbatore", placeId: "cbe_6" },
      { description: "Codissia Trade Fair Complex, Peelamedu, Coimbatore", placeId: "cbe_7" },
    ];
    return places.filter((p) => p.description.toLowerCase().includes(queryText.toLowerCase()));
  },
};
