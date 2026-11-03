import { VehicleCategoryKey } from "../types/driver-onboarding";

export interface VehicleCategoryConfig {
  key: VehicleCategoryKey;
  displayName: string;
  tagline: string;
  maxPayloadKg: number;
  dimensionsFeet: {
    length: number;
    width: number;
    height: number;
  };
  supportedBookingTypes: ("instant" | "scheduled")[];
  helperEligible: boolean;
  baseFarePaise: number;
  perKmRatePaise: number;
  sampleModels: string;
  badge: string;
}

export const COIMBATORE_VEHICLE_ONBOARDING_CATEGORIES: VehicleCategoryConfig[] = [
  {
    key: "three_wheeler",
    displayName: "Three-Wheeler Cargo (Auto)",
    tagline: "Ideal for small parcels, cartons & electronics",
    maxPayloadKg: 500,
    dimensionsFeet: { length: 5.5, width: 4.2, height: 4.5 },
    supportedBookingTypes: ["instant", "scheduled"],
    helperEligible: true,
    baseFarePaise: 25000,
    perKmRatePaise: 2200,
    sampleModels: "Piaggio Ape, Bajaj Maxima C, Mahindra Alfa",
    badge: "🛺 500 kg",
  },
  {
    key: "mini_goods",
    displayName: "Mini Goods Vehicle (8 ft)",
    tagline: "Compact 4-wheeler for narrow city lanes",
    maxPayloadKg: 750,
    dimensionsFeet: { length: 7.0, width: 4.5, height: 5.0 },
    supportedBookingTypes: ["instant", "scheduled"],
    helperEligible: true,
    baseFarePaise: 38000,
    perKmRatePaise: 2600,
    sampleModels: "Maruti Super Carry, Mahindra Jeeto",
    badge: "🚚 750 kg",
  },
  {
    key: "tata_ace",
    displayName: "Tata Ace / Chota Hathi (8.5 ft)",
    tagline: "Coimbatore's most popular commercial workhorse",
    maxPayloadKg: 850,
    dimensionsFeet: { length: 8.5, width: 4.8, height: 5.5 },
    supportedBookingTypes: ["instant", "scheduled"],
    helperEligible: true,
    baseFarePaise: 45000,
    perKmRatePaise: 3000,
    sampleModels: "Tata Ace Gold, Tata Ace EV, Ashok Leyland Dost Mini",
    badge: "⭐ Most Popular · 850 kg",
  },
  {
    key: "pickup",
    displayName: "Pickup Vehicle (9 ft - 10 ft)",
    tagline: "Heavy machinery, timber, pump sets & industrial goods",
    maxPayloadKg: 1500,
    dimensionsFeet: { length: 9.8, width: 5.5, height: 6.0 },
    supportedBookingTypes: ["instant", "scheduled"],
    helperEligible: true,
    baseFarePaise: 75000,
    perKmRatePaise: 4200,
    sampleModels: "Mahindra Bolero Maxi Truck, Ashok Leyland Bada Dost",
    badge: "💪 1,500 kg",
  },
  {
    key: "mini_van",
    displayName: "Closed Container Mini Van",
    tagline: "Weatherproof transport for textile rolls, garments & fragile goods",
    maxPayloadKg: 1000,
    dimensionsFeet: { length: 8.5, width: 4.8, height: 5.5 },
    supportedBookingTypes: ["instant", "scheduled"],
    helperEligible: true,
    baseFarePaise: 55000,
    perKmRatePaise: 3400,
    sampleModels: "Tata Ace Container, Eicher C1",
    badge: "🔒 Weatherproof · 1,000 kg",
  },
  {
    key: "large_goods",
    displayName: "14 ft / 17 ft Large Goods Truck",
    tagline: "Complete home relocation, industrial casting & bulk logistics",
    maxPayloadKg: 3500,
    dimensionsFeet: { length: 14.0, width: 6.5, height: 7.0 },
    supportedBookingTypes: ["scheduled"],
    helperEligible: true,
    baseFarePaise: 130000,
    perKmRatePaise: 5800,
    sampleModels: "Tata 407, Eicher Pro 2049, BharatBenz 914",
    badge: "🏢 Heavy Relocation · 3,500 kg",
  },
];

export const COIMBATORE_LOCALITIES = [
  "Gandhipuram (Central Hub)",
  "RS Puram",
  "Peelamedu & Hopes College",
  "Singanallur & Trichy Road",
  "Saravanampatti & IT SEZ",
  "Ganapathy & Athipalayam",
  "Saibaba Colony & NSR Road",
  "Kuniyamuthur & Palakkad Road",
  "Ukkadam & Town Hall",
  "Thudiyalur & Mettupalayam Road",
  "Kovaipudur",
  "Sundarapuram & Pollachi Road",
  "Ondipudur & Irugur",
  "Vadavalli & Marudhamalai Road",
  "Sulur & Aerospace Park",
  "Malumichampatti & SIDCO Industrial Estate",
  "Kurichi Industrial Estate",
  "Kalapatti & Coimbatore Airport",
  "Kavundampalayam & Edayarpalayam",
  "Perur & Selvapuram",
];
