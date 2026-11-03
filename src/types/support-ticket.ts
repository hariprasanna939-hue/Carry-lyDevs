export type SupportTicketStatus = "open" | "in_progress" | "resolved" | "closed";

export interface SupportTicketDocument {
  id?: string;
  userId: string;
  bookingId?: string | null;
  issue: string;
  status: SupportTicketStatus;
  subject?: string; // Optional convenience field
  createdAt: unknown;
  updatedAt?: unknown;
}
