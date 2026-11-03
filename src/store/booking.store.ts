import { LocationPoint, CargoDetails, FareBreakdown } from "../types/booking";

export interface BookingDraft {
  pickup: LocationPoint | null;
  dropoff: LocationPoint | null;
  vehicleCategoryId: string | null;
  cargo: CargoDetails | null;
  helpersCount: number;
  isInstant: boolean;
  scheduledTime: string | null;
  estimatedDistanceKm: number;
  fareBreakdown: FareBreakdown | null;
  paymentMethod: "cash" | "upi" | "card";
}

const initialDraft: BookingDraft = {
  pickup: null,
  dropoff: null,
  vehicleCategoryId: "tata_ace",
  cargo: null,
  helpersCount: 0,
  isInstant: true,
  scheduledTime: null,
  estimatedDistanceKm: 5,
  fareBreakdown: null,
  paymentMethod: "cash",
};

let currentDraft: BookingDraft = { ...initialDraft };
const listeners = new Set<(state: BookingDraft) => void>();

export const bookingStore = {
  getDraft(): BookingDraft {
    return currentDraft;
  },

  updateDraft(updates: Partial<BookingDraft>) {
    currentDraft = { ...currentDraft, ...updates };
    listeners.forEach((l) => l(currentDraft));
  },

  resetDraft() {
    currentDraft = { ...initialDraft };
    listeners.forEach((l) => l(currentDraft));
  },

  subscribe(listener: (state: BookingDraft) => void) {
    listeners.add(listener);
    listener(currentDraft);
    return () => {
      listeners.delete(listener);
    };
  },
};
