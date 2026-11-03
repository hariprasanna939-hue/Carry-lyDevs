import { CarryUser, UserRole, ActivePortal } from "../../types/user";

export interface LoginCredentials {
  email: string;
  password?: string;
  phone?: string;
}

export interface RegisterPayload {
  fullName: string;
  email: string;
  phone: string;
  password?: string;
  role?: UserRole;
}

export interface AuthSession {
  user: CarryUser;
  token?: string;
}
