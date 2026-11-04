export interface VehicleRecord {
  id: string;
  driverId: string;
  vehicleType: string;
  registrationNumber: string;
  capacityKg: number;
  vehiclePhotos?: string[];
  verificationStatus: 'pending' | 'approved' | 'rejected';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RegisterVehicleInput {
  vehicleType: string;
  registrationNumber: string;
  capacityKg?: number;
  vehiclePhotos?: string[];
}
