export type DriverVerificationStatus =
  | 'unsubmitted'
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'suspended';

export interface DriverLocation {
  latitude: number;
  longitude: number;
  heading?: number;
  speed?: number;
  updatedAt: string;
}

export interface DriverDocument {
  type: 'aadhaar' | 'driving_license' | 'pan' | 'rc' | 'insurance' | 'police_clearance';
  documentNumber?: string;
  frontUrl: string;
  backUrl?: string;
  verified: boolean;
  uploadedAt: string;
  verifiedAt?: string;
  rejectionReason?: string;
}

export interface DriverProfile {
  userId: string;
  fullName: string;
  phone: string;
  email: string;
  verificationStatus: DriverVerificationStatus;
  onlineStatus: boolean;
  serviceAreas: string[];
  activeVehicleId?: string;
  rating: number;
  totalTrips: number;
  totalEarnings: number;
  currentLocation?: DriverLocation;
  rejectionReason?: string;
  approvedAt?: string;
  documentsSubmittedAt?: string;
  createdAt: string;
  updatedAt: string;
}
