export type DriverApplicationStatus =
  | "DRAFT"
  | "INCOMPLETE"
  | "SUBMITTED"
  | "UNDER_REVIEW"
  | "NEEDS_CORRECTION"
  | "APPROVED"
  | "REJECTED"
  | "SUSPENDED";

export type ApprovalLevelStatus =
  | "pending"
  | "verified"
  | "rejected"
  | "needs_correction";

export interface DriverPersonalDetails {
  fullName: string;
  dob: string; // YYYY-MM-DD
  gender?: "male" | "female" | "other" | "prefer_not_to_say";
  verifiedPhone: string;
  alternatePhone?: string;
  email?: string;
  houseNo: string;
  street: string;
  area: string;
  city: string; // Default: Coimbatore
  district: string; // Default: Coimbatore
  state: string; // Default: Tamil Nadu
  pinCode: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactRelation: string;
}

export type IdentityDocType = "aadhaar" | "driving_licence" | "voter_id" | "passport";

export interface DriverIdentityDocument {
  docType: IdentityDocType;
  nameOnDoc: string;
  docNumberMasked: string; // e.g. "XXXX-XXXX-1234"
  frontImageUrl: string;
  backImageUrl?: string;
  verificationStatus: ApprovalLevelStatus;
  adminRemarks?: string;
  updatedAt?: string;
}

export interface DriverLicenseDetails {
  licenceNumber: string;
  nameOnLicence: string;
  dob: string;
  issueDate: string;
  expiryDate: string;
  issuingAuthority: string;
  licenceClass: string; // e.g. "LMV-TR", "LMV", "TRANS", "3W-CAB"
  frontImageUrl: string;
  backImageUrl: string;
  isExpired: boolean;
  verificationStatus: ApprovalLevelStatus;
  adminRemarks?: string;
}

export type VehicleCategoryKey =
  | "three_wheeler"
  | "mini_goods"
  | "tata_ace"
  | "pickup"
  | "mini_van"
  | "large_goods";

export type VehicleOwnershipType =
  | "self"
  | "family"
  | "rented"
  | "leased"
  | "authorised";

export interface RegisteredVehicle {
  id: string;
  registrationNumber: string; // e.g. "TN 38 AB 1234"
  category: VehicleCategoryKey;
  categoryDisplayName: string;
  make: string;
  model: string;
  year: string;
  color: string;
  fuelType: "diesel" | "petrol" | "cng" | "electric";
  bodyType: "open_top" | "closed_container" | "tarpaulin" | "flatbed";
  registeredOwnerName: string;
  ownershipType: VehicleOwnershipType;
  payloadCapacityKg: number;
  dimensionsFeet: {
    length: number;
    width: number;
    height: number;
  };
  approvalStatus: ApprovalLevelStatus;
  rejectionReason?: string;
  documents: {
    rcFrontUrl: string;
    rcBackUrl?: string;
    insuranceUrl: string;
    insuranceExpiry: string;
    fitnessUrl?: string;
    fitnessExpiry?: string;
    permitUrl?: string;
    pucUrl?: string;
    ownerAuthorizationUrl?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface DriverBankDetails {
  accountHolderName: string;
  accountNumberMasked: string; // e.g. "XXXXXX7890"
  accountNumberHash?: string;
  ifscCode: string;
  bankName: string;
  branchName?: string;
  verificationStatus: ApprovalLevelStatus;
  adminRemarks?: string;
}

export interface DriverServicePreferences {
  primaryArea: string; // Central Coimbatore hub
  preferredLocalities: string[];
  preferredWorkingHours: "morning" | "evening" | "full_day" | "flexible";
  workingDays: string[];
  currentAvailability: "online" | "offline" | "temporarily_unavailable";
}

export interface DriverHelperPreferences {
  providesHelpers: "yes" | "no" | "conditional";
  helperCount: number;
  helperRatePaise: number; // e.g. 20000 = Rs 200
  notes?: string;
}

export interface DriverCorrectionItem {
  id: string;
  section: "identity" | "licence" | "vehicle" | "vehicle_doc" | "bank" | "profile_photo";
  documentType: string;
  targetId?: string; // vehicleId if section === vehicle
  rejectionReason: string;
  requiredAction: string;
  submittedAt: string;
  resolved: boolean;
}

export interface DriverApplicationRecord {
  applicationId: string;
  driverUid: string;
  currentStep: number; // 1 to 12
  status: DriverApplicationStatus;
  submissionDate?: string;
  lastUpdatedDate: string;
  referenceNumber: string; // e.g. "CARRY-DRV-2026-8941"

  // 3-level Decoupled Approvals
  driverApproval: ApprovalLevelStatus;
  vehicleApproval: ApprovalLevelStatus;
  bankVerification: ApprovalLevelStatus;

  // Step Data
  personalDetails?: DriverPersonalDetails;
  profilePhotoUrl?: string;
  identityDoc?: DriverIdentityDocument;
  licenceDetails?: DriverLicenseDetails;
  vehicles: RegisteredVehicle[];
  activeVehicleId?: string;
  bankDetails?: DriverBankDetails;
  servicePreferences?: DriverServicePreferences;
  helperPreferences?: DriverHelperPreferences;

  // Correction Tracking
  correctionItems: DriverCorrectionItem[];
  adminRemarks?: string;
  declarationAccepted: boolean;
  termsAccepted: boolean;
}

export interface AdminAuditLog {
  id: string;
  adminUid: string;
  driverUid: string;
  action: "APPROVE_DRIVER" | "REJECT_DRIVER" | "REQUEST_CORRECTION" | "APPROVE_VEHICLE" | "REJECT_VEHICLE" | "VERIFY_BANK" | "SUSPEND_DRIVER";
  previousStatus: string;
  newStatus: string;
  reason: string;
  timestamp: string;
}
