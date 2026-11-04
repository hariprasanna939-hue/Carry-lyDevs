export type UserRole = 'customer' | 'driver' | 'admin';
export type PortalType = 'customer' | 'driver';
export type AccountStatus = 'active' | 'suspended' | 'deleted';

export interface UserProfile {
  uid: string;
  name: string;
  phone: string;
  email: string;
  roles: UserRole[];
  activePortal: PortalType;
  photoURL?: string;
  accountStatus: AccountStatus;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
  lastLogoutAt?: string;
  deactivatedAt?: string;
  deactivationReason?: string;
  fcmTokens?: string[];
}
