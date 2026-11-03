export type UserRole = "customer" | "driver";

export type ActivePortal = "customer" | "driver";

export type DriverVerificationStatus =
  | "not_applied"
  | "pending"
  | "approved"
  | "rejected";

export interface CarryUser {
  uid: string;
  fullName: string;
  name?: string; // Compatibility alias
  email: string;
  phone: string;
  roles: UserRole[];
  activePortal: ActivePortal;
  driverVerificationStatus: DriverVerificationStatus;
  accountStatus: "active" | "suspended";
  photoURL?: string;
  createdAt?: unknown;
  updatedAt?: unknown;
}
