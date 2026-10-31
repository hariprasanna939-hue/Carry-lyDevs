export interface VehicleCategory {
  id: string;
  name: string;
  tagline: string;
  icon: string;
  capacityKg: number;
  dimensions: string;
  baseFarePaise: number;
  perKmRatePaise: number;
  minFarePaise: number;
  isActive: boolean;
}

export const COIMBATORE_VEHICLE_CATEGORIES: VehicleCategory[] = [
  {
    id: "3_wheeler_cargo",
    name: "3-Wheeler Cargo",
    tagline: "Small loads & quick city delivery",
    icon: "🛺",
    capacityKg: 500,
    dimensions: "5 x 3.5 x 4 ft",
    baseFarePaise: 25000, // ₹250
    perKmRatePaise: 2200, // ₹22/km
    minFarePaise: 25000,
    isActive: true,
  },
  {
    id: "tata_ace",
    name: "Tata Ace / Mini Truck",
    tagline: "Most popular for shifting & commercial goods",
    icon: "🚚",
    capacityKg: 850,
    dimensions: "7 x 4.5 x 5 ft",
    baseFarePaise: 35000, // ₹350
    perKmRatePaise: 2800, // ₹28/km
    minFarePaise: 35000,
    isActive: true,
  },
  {
    id: "pickup_truck",
    name: "Bolero Pickup / 8ft",
    tagline: "Bulky furniture, construction & heavy cargo",
    icon: "🚛",
    capacityKg: 1500,
    dimensions: "8 x 5 x 5.5 ft",
    baseFarePaise: 55000, // ₹550
    perKmRatePaise: 3500, // ₹35/km
    minFarePaise: 55000,
    isActive: true,
  },
  {
    id: "large_commercial",
    name: "Tata 407 / Large Van",
    tagline: "Complete 2-3 BHK home shifting & industrial logistics",
    icon: "🏗️",
    capacityKg: 2500,
    dimensions: "10 x 6 x 6 ft",
    baseFarePaise: 85000, // ₹850
    perKmRatePaise: 4800, // ₹48/km
    minFarePaise: 85000,
    isActive: true,
  },
];
