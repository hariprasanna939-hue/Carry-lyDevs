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

export interface VehicleDocument {
  id?: string;
  driverId: string;
  vehicleType: string;
  registrationNumber: string;
  capacityKg: number;
  vehiclePhotos: string[];
  verificationStatus: "pending" | "approved" | "rejected";
  isActive: boolean;
  createdAt?: unknown;
  updatedAt?: unknown;
}
