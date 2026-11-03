export interface AppNotification {
  id?: string;
  userId: string;
  title: string;
  body: string;
  read: boolean;
  message?: string; // Backwards compatibility alias
  type?: "booking" | "payment" | "system";
  createdAt: unknown;
}
