import { useState, useEffect } from "react";
import { portalStore } from "../store/portal.store";
import { ActivePortal } from "../types/user";

export function useActivePortal() {
  const [activePortal, setActivePortal] = useState<ActivePortal>(portalStore.getPortal());

  useEffect(() => {
    return portalStore.subscribe((state) => {
      setActivePortal(state.activePortal);
    });
  }, []);

  return {
    activePortal,
    setPortal: portalStore.setPortal,
    isDriver: activePortal === "driver",
    isCustomer: activePortal === "customer",
  };
}
