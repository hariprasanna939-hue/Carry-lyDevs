import { BookingStatusValue } from "../constants/booking-status";

export interface LocationPoint {
  address: string;
  latitude: number;
  longitude: number;
  landmark?: string;
  contactName?: string;
  contactPhone?: string;
}

export interface CargoItem {
  name?: string;
  category: string;
  description?: string;
  quantity?: number;
  estimatedWeightKg?: number;
  isFragile?: boolean;
}

export type CargoDetails = CargoItem;

export interface FareBreakdown {
  baseFare?: number;
  perKmFare?: number;
  baseFarePaise: number;
  distanceFarePaise: number;
  helperFarePaise: number;
  tollFarePaise: number;
  totalFarePaise: number;
}

export interface Booking {
  id: string;
  customerId: string;
  driverId?: string;
  vehicleId?: string;
  vehicleCategory: string; // Category identifier (e.g. tata_ace)
  pickup: LocationPoint;
  drop: LocationPoint; // Exact Firestore schema key
  dropoff: LocationPoint; // Backwards compatibility alias
  items: CargoItem[]; // Exact Firestore schema key
  cargo: CargoItem; // Backwards compatibility alias
  helperCount: number; // Exact Firestore schema key
  helpersCount: number; // Backwards compatibility alias
  scheduledAt?: string | null; // Exact Firestore schema key
  scheduledTime?: string; // Backwards compatibility alias
  distanceKm: number; // Exact Firestore schema key
  estimatedDistanceKm?: number;
  fareBreakdown: FareBreakdown;
  fare: FareBreakdown; // Alias
  totalFare: number; // Exact Firestore schema key (in Rupees or Paise)
  paymentStatus: "pending" | "paid" | "failed";
  bookingStatus: BookingStatusValue; // Exact Firestore schema key
  status: BookingStatusValue; // Alias
  isInstant?: boolean;
  paymentMethod?: "cash" | "upi" | "card";
  pickupOtp?: string;
  deliveryOtp?: string;
  createdAt: unknown;
  completedAt?: unknown;
  updatedAt?: unknown;
}
