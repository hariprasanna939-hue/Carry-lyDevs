export * from '../../common/types/Driver';

export interface SubmitDriverApplicationInput {
  fullName: string;
  phone: string;
  serviceAreas?: string[];
  vehicleType: string;
  vehicleRegistrationNumber: string;
  capacityKg?: number;
  documents: {
    type: 'aadhaar' | 'driving_license' | 'pan' | 'rc' | 'insurance' | 'police_clearance';
    documentNumber?: string;
    frontUrl: string;
    backUrl?: string;
  }[];
}

export interface UpdateAvailabilityInput {
  onlineStatus: boolean;
  latitude?: number;
  longitude?: number;
}
