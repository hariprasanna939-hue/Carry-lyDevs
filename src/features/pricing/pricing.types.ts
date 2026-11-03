import { FareBreakdown } from "../../types/booking";

export interface CalculateFareInput {
  vehicleId: string;
  distanceKm: number;
  helpersCount?: number;
}

export type { FareBreakdown };
