export type UserRole = "customer" | "driver" | "admin";

export type BookingStatus =
  | "draft"
  | "pending"
  | "searching"
  | "accepted"
  | "arrived_pickup"
  | "loading_started"
  | "in_transit"
  | "delivered"
  | "completed"
  | "cancelled";

export type PaymentMethod = "cash" | "upi" | "card" | "razorpay";
export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

export interface LocationPoint {
  address: string;
  latitude: number;
  longitude: number;
  contactName?: string;
  contactPhone?: string;
}

export interface CargoItem {
  category: string;
  description?: string;
  quantity?: number;
  estimatedWeightKg?: number;
  isFragile?: boolean;
}

export interface FareBreakdown {
  baseFarePaise: number;
  distanceFarePaise: number;
  helperFarePaise: number;
  tollFarePaise: number;
  totalFarePaise: number;
}
