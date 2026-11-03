import { vehiclesService } from "../vehicles/vehicles.service";
import { CalculateFareInput, FareBreakdown } from "./pricing.types";
import { APP_CONFIG } from "../../constants/config";

export const pricingService = {
  calculateFare({ vehicleId, distanceKm, helpersCount = 0 }: CalculateFareInput): FareBreakdown {
    const vehicle = vehiclesService.getVehicleById(vehicleId);
    const baseFarePaise = vehicle ? vehicle.baseFarePaise : 35000;
    const perKmRatePaise = vehicle ? vehicle.perKmRatePaise : 2800;

    const distanceFarePaise = Math.round(distanceKm * perKmRatePaise);
    const helperFarePaise = helpersCount * APP_CONFIG.helperRatePaise;
    const tollFarePaise = 0; // City deliveries typically zero toll unless highway bypass
    const totalFarePaise = Math.max(
      baseFarePaise,
      baseFarePaise + distanceFarePaise + helperFarePaise + tollFarePaise
    );

    return {
      baseFarePaise,
      distanceFarePaise,
      helperFarePaise,
      tollFarePaise,
      totalFarePaise,
    };
  },
};
