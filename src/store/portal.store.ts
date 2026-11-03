import { ActivePortal } from "../types/user";

export interface PortalState {
  activePortal: ActivePortal;
}

let portalState: PortalState = {
  activePortal: "customer",
};

const listeners = new Set<(state: PortalState) => void>();

export const portalStore = {
  getPortal(): ActivePortal {
    return portalState.activePortal;
  },

  setPortal(portal: ActivePortal) {
    portalState = { activePortal: portal };
    listeners.forEach((l) => l(portalState));
  },

  subscribe(listener: (state: PortalState) => void) {
    listeners.add(listener);
    listener(portalState);
    return () => {
      listeners.delete(listener);
    };
  },
};
