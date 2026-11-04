export type VehicleType = 'two_wheeler' | 'three_wheeler' | 'tata_ace' | 'pickup_8ft';

export type BookingStatus =
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

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';
export type PaymentMethod = 'online' | 'cash' | 'wallet';

export interface LocationPoint {
  address: string;
  landmark?: string;
  latitude: number;
  longitude: number;
  contactName: string;
  contactPhone: string;
}

export interface CargoItem {
  name: string;
  category?: string;
  quantity: number;
  weightApproxKg?: number;
}

export interface FareBreakdown {
  baseFare: number;
  distanceFare: number;
  timeFare: number;
  helperFee: number;
  tax: number;
  discount: number;
  total: number;
}

export interface Booking {
  id: string;
  customerId: string;
  driverId?: string;
  vehicleId?: string;
  vehicleType: VehicleType;
  pickup: LocationPoint;
  drop: LocationPoint;
  items: CargoItem[];
  helperCount: number;
  scheduledAt: string;
  isScheduled: boolean;
  distanceKm: number;
  estimatedDurationMinutes: number;
  fareBreakdown: FareBreakdown;
  totalFare: number;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  pickupOtp?: string;
  dropOtp?: string;
  rejectionHistory?: string[];
  cancelledBy?: 'customer' | 'driver' | 'admin' | 'system';
  cancellationReason?: string;
  createdAt: string;
  updatedAt: string;
  acceptedAt?: string;
  completedAt?: string;
}
