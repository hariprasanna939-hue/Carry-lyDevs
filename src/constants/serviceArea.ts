export interface ServiceArea {
  id: string;
  name: string;
  center: {
    latitude: number;
    longitude: number;
  };
  radiusKm: number;
  isActive: boolean;
}

export const COIMBATORE_SERVICE_AREA: ServiceArea = {
  id: "coimbatore_tn",
  name: "Coimbatore, Tamil Nadu",
  center: {
    latitude: 11.0168,
    longitude: 76.9558,
  },
  radiusKm: 35, // Covers Gandhipuram, Peelamedu, Saravanampatti, Kurichi, Pollachi Road junction, etc.
  isActive: true,
};
