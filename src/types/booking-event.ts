export type BookingEventType =
  | "created"
  | "searching_driver"
  | "driver_assigned"
  | "driver_arrived"
  | "loading_started"
  | "in_transit"
  | "delivered"
  | "payment_received"
  | "cancelled";

export interface BookingEvent {
  id?: string;
  bookingId: string;
  eventType: BookingEventType;
  description: string;
  createdBy: string; // uid of user, driver, or "system"
  createdAt: unknown;
}
