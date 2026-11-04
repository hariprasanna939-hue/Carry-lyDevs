import { onCall } from 'firebase-functions/v2/https';
import { assertAuthenticated } from '../../common/middleware/authenticate';
import { validateRequest } from '../../common/middleware/validateRequest';
import { validateRegisterVehicle } from './vehicle.validation';
import { VehicleService } from './vehicle.service';
import { handleError } from '../../common/errors/errorHandler';
import { createSuccessResponse } from '../../common/types/ApiResponse';
import { VehicleRecord } from './vehicle.types';

export const registerVehicle = onCall(async (request) => {
  try {
    const driverId = assertAuthenticated(request);
    const input = validateRequest(request.data, validateRegisterVehicle);
    const vehicle = await VehicleService.registerVehicle(driverId, input);
    return createSuccessResponse(vehicle, 'Vehicle registered successfully');
  } catch (error) {
    return handleError(error, 'registerVehicle');
  }
});

export const updateVehicle = onCall(async (request) => {
  try {
    const driverId = assertAuthenticated(request);
    const d = request.data as { vehicleId?: string; updates?: Partial<VehicleRecord> };
    if (!d?.vehicleId || !d?.updates) throw new Error('vehicleId and updates are required');

    const updated = await VehicleService.updateVehicle(driverId, d.vehicleId, d.updates);
    return createSuccessResponse(updated, 'Vehicle updated successfully');
  } catch (error) {
    return handleError(error, 'updateVehicle');
  }
});

export const listVehicleSizes = onCall(() => {
  try {
    const sizes = VehicleService.listVehicleSizes();
    return createSuccessResponse(sizes);
  } catch (error) {
    return handleError(error, 'listVehicleSizes');
  }
});

export const validateVehicleDocuments = onCall(async (request) => {
  try {
    assertAuthenticated(request);
    const d = request.data as {
      vehicleId: string;
      documents: { rcDocUrl?: string; insuranceDocUrl?: string; fitnessDocUrl?: string };
    };
    if (!d?.vehicleId || !d?.documents) throw new Error('vehicleId and documents are required');

    const result = await VehicleService.validateVehicleDocuments(d.vehicleId, d.documents);
    return createSuccessResponse(result, 'Vehicle documents verified and saved');
  } catch (error) {
    return handleError(error, 'validateVehicleDocuments');
  }
});

export const getMyVehicles = onCall(async (request) => {
  try {
    const driverId = assertAuthenticated(request);
    const vehicles = await VehicleService.getDriverVehicles(driverId);
    return createSuccessResponse(vehicles);
  } catch (error) {
    return handleError(error, 'getMyVehicles');
  }
});
