export * from '../../common/types/User';

export interface UpdateProfileInput {
  name?: string;
  phone?: string;
  photoURL?: string;
}

export interface SwitchPortalInput {
  portal: 'customer' | 'driver';
}
