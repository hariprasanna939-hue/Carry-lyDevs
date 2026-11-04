/**
 * CARRY Firestore Database Schema Types
 *
 * Defines the exact document structures for all collections:
 * 1.  users/{uid}
 * 2.  driverApplications/{uid}
 * 3.  drivers/{uid}
 * 4.  vehicles/{vehicleId}
 * 5.  bookings/{bookingId}
 * 6.  driverJobOffers/{offerId}
 * 7.  trips/{tripId}
 * 8.  payments/{paymentId}
 * 9.  driverEarnings/{earningId}
 * 10. savedAddresses/{addressId}
 * 11. notifications/{notificationId}
 * 12. reviews/{reviewId}
 * 13. supportTickets/{ticketId}
 * 14. pricingConfig/{configId}
 * 15. adminAuditLogs/{logId}
 */

// 1. users/{uid}
export interface UserDocument {
  role: 'customer' | 'driver' | 'admin';
  roles?: string[]; // for multi-role support
  fullName: string;
  email: string;
  phone: string;
  profileImage?: string;
  accountStatus: 'active' | 'suspended' | 'deleted';
  activePortal?: 'customer' | 'driver';
  createdAt: string;
  updatedAt?: string;
}

// 2. driverApplications/{uid}
export interface DriverApplicationDocument {
  personalDetails: {
    fullName: string;
    phone: string;
    email: string;
    city: string;
    address?: string;
  };
  identityDetails: {
    aadhaarNumber?: string;
    panNumber?: string;
    aadhaarFrontUrl?: string;
    aadhaarBackUrl?: string;
    panCardUrl?: string;
  };
  drivingDetails: {
    licenseNumber: string;
    licenseExpiry?: string;
    licenseFrontUrl: string;
    licenseBackUrl?: string;
  };
  vehicleDetails: {
    vehicleType: string;
    vehicleSize: string;
    registrationNumber: string;
    capacityKg: number;
    rcDocUrl?: string;
    insuranceDocUrl?: string;
  };
  documentReferences: Record<string, string>;
  onboardingCompleted: boolean;
  approvalStatus: 'unsubmitted' | 'pending' | 'approved' | 'rejected' | 'suspended';
  rejectionReason?: string;
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
}

// 3. drivers/{uid}
export interface DriverDocument {
  isAvailable: boolean;
  activeVehicleId?: string;
  currentLocation?: {
    latitude: number;
    longitude: number;
    heading?: number;
    speed?: number;
    updatedAt: string;
  };
  rating: number;
  completedTrips: number;
  totalEarningsPaise?: number;
  updatedAt: string;
}

// 4. vehicles/{vehicleId}
export interface VehicleDocument {
  driverId: string;
  vehicleType: string;
  vehicleSize: 'two_wheeler' | 'three_wheeler' | 'tata_ace' | 'pickup_8ft' | string;
  registrationNumber: string;
  verificationStatus: 'pending' | 'approved' | 'rejected';
  capacityKg?: number;
  vehiclePhotos?: string[];
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// 5. bookings/{bookingId}
export interface BookingDocument {
  customerId: string;
  driverId?: string;
  pickup: {
    address: string;
    landmark?: string;
    latitude: number;
    longitude: number;
    contactName: string;
    contactPhone: string;
  };
  drop: {
    address: string;
    landmark?: string;
    latitude: number;
    longitude: number;
    contactName: string;
    contactPhone: string;
  };
  vehicleSize: 'two_wheeler' | 'three_wheeler' | 'tata_ace' | 'pickup_8ft' | string;
  bookingType: 'immediate' | 'scheduled';
  helperCount: number;
  scheduledAt: string;
  fare: {
    baseFare: number;
    distanceFare: number;
    timeFare: number;
    helperFee: number;
    tax: number;
    discount: number;
    total: number;
  };
  bookingStatus:
    | 'created'
    | 'searching'
    | 'accepted'
    | 'arrived_at_pickup'
    | 'loading'
    | 'in_transit'
    | 'arrived_at_drop'
    | 'unloading'
    | 'completed'
    | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod?: 'online' | 'cash' | 'wallet';
  pickupOtp?: string;
  dropOtp?: string;
  cancelledBy?: 'customer' | 'driver' | 'admin' | 'system';
  cancellationReason?: string;
  createdAt: string;
  updatedAt?: string;
}

// 6. driverJobOffers/{offerId}
export interface DriverJobOfferDocument {
  bookingId: string;
  driverId: string;
  status: 'pending' | 'accepted' | 'rejected' | 'expired';
  expiresAt: string;
  createdAt: string;
}

// 7. trips/{tripId}
export interface TripDocument {
  bookingId: string;
  customerId: string;
  driverId: string;
  startedAt?: string;
  completedAt?: string;
  tripStatus: 'accepted' | 'arrived_pickup' | 'in_transit' | 'arrived_drop' | 'completed' | 'cancelled';
  routePoints?: { latitude: number; longitude: number; timestamp: string }[];
  deliveryProofUrl?: string;
  createdAt: string;
  updatedAt?: string;
}

// 8. payments/{paymentId}
export interface PaymentDocument {
  bookingId: string;
  customerId: string;
  amount: number;
  currency: string;
  gatewayReference: string; // Razorpay orderId / paymentId
  status: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod?: string;
  refundReason?: string;
  createdAt: string;
  updatedAt?: string;
}

// 9. driverEarnings/{earningId}
export interface DriverEarningDocument {
  driverId: string;
  bookingId: string;
  grossAmount: number;
  commission: number;
  netAmount: number;
  status: 'credited' | 'pending' | 'withdrawn';
  createdAt: string;
}

// 10. savedAddresses/{addressId}
export interface SavedAddressDocument {
  userId: string;
  label: string;
  address: string;
  landmark?: string;
  latitude: number;
  longitude: number;
  contactName?: string;
  contactPhone?: string;
  createdAt: string;
}

// 11. notifications/{notificationId}
export interface NotificationDocument {
  userId: string;
  title: string;
  body: string;
  data?: Record<string, unknown>;
  read: boolean;
  createdAt: string;
}

// 12. reviews/{reviewId}
export interface ReviewDocument {
  bookingId: string;
  reviewerId: string;
  targetUserId: string;
  rating: number;
  comment?: string;
  createdAt: string;
}

// 13. supportTickets/{ticketId}
export interface SupportTicketDocument {
  userId: string;
  bookingId?: string;
  category: string;
  subject: string;
  description: string;
  evidenceUrls?: string[];
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  resolutionNote?: string;
  resolvedBy?: string;
  resolvedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// 14. pricingConfig/{configId}
export interface PricingConfigDocument {
  city: string;
  vehicleRates: Record<
    string,
    {
      baseFare: number;
      baseKm: number;
      perKmRate: number;
      perMinuteRate: number;
      capacityKg: number;
    }
  >;
  helperRatePerPerson: number;
  nightSurcharge: number;
  gstRate: number;
  updatedAt: string;
  updatedBy: string;
}

// 15. adminAuditLogs/{logId}
export interface AdminAuditLogDocument {
  adminId: string;
  action: string;
  targetType: string;
  targetId: string;
  details?: Record<string, unknown>;
  timestamp: string;
}
