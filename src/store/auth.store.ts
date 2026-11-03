import { CarryUser } from "../types/user";

export interface AuthState {
  user: CarryUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

let currentAuthState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
};

const listeners = new Set<(state: AuthState) => void>();

export const authStore = {
  getState(): AuthState {
    return currentAuthState;
  },

  setState(newState: Partial<AuthState>) {
    currentAuthState = { ...currentAuthState, ...newState };
    listeners.forEach((listener) => listener(currentAuthState));
  },

  subscribe(listener: (state: AuthState) => void) {
    listeners.add(listener);
    listener(currentAuthState);
    return () => {
      listeners.delete(listener);
    };
  },
};
