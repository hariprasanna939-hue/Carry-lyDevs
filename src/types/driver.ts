export type DriverVerificationStatus =
  | "not_applied"
  | "pending"
  | "approved"
  | "rejected";

export interface DriverVehicleDetails {
  category: string;
  model: string;
  plateNumber: string;
  registrationYear: string;
  capacityKg: number;
}

export interface DriverDocuments {
  drivingLicenseUrl?: string;
  rcBookUrl?: string;
  insuranceUrl?: string;
  aadharUrl?: string;
}

export interface DriverProfile {
  userId: string;
  fullName: string;
  phone: string;
  email?: string;
  verificationStatus: DriverVerificationStatus;
  onlineStatus: boolean;
  serviceAreas: string[];
  rating: number;
  totalTrips: number;
  serviceCity?: string;
  vehicle?: DriverVehicleDetails;
  documents?: DriverDocuments;
  totalEarningsPaise?: number;
  currentLatitude?: number;
  currentLongitude?: number;
  createdAt?: unknown;
  updatedAt?: unknown;
}
