export const BOOKING_STATUS = {
  DRAFT: "draft",
  PENDING: "pending",
  SEARCHING: "searching",
  ACCEPTED: "accepted",
  ARRIVED_PICKUP: "arrived_pickup",
  IN_TRANSIT: "in_transit",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
} as const;

export type BookingStatusValue = typeof BOOKING_STATUS[keyof typeof BOOKING_STATUS];

export const BOOKING_STATUS_LABELS: Record<BookingStatusValue, string> = {
  draft: "Draft",
  pending: "Pending",
  searching: "Looking for Driver",
  accepted: "Driver Assigned",
  arrived_pickup: "Driver Arrived at Pickup",
  in_transit: "In Transit",
  completed: "Delivered",
  cancelled: "Cancelled",
};
