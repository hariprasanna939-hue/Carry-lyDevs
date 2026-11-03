export interface Review {
  id?: string;
  bookingId: string;
  customerId: string;
  driverId: string;
  rating: number; // 1 to 5
  comment: string;
  reviewerId?: string; // Backwards compatibility alias
  targetUserId?: string; // Backwards compatibility alias
  createdAt?: unknown;
}
