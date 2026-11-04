import { onCall } from 'firebase-functions/v2/https';
import { assertAuthenticated } from '../../common/middleware/authenticate';
import { validateRequest } from '../../common/middleware/validateRequest';
import { validateSaveAddressInput, SaveAddressInput } from './address.validation';
import { AddressService } from './address.service';
import { handleError } from '../../common/errors/errorHandler';
import { createSuccessResponse } from '../../common/types/ApiResponse';

export const saveAddress = onCall(async (request) => {
  try {
    const userId = assertAuthenticated(request);
    const input = validateRequest(request.data, validateSaveAddressInput);
    const address = await AddressService.saveAddress(userId, input);
    return createSuccessResponse(address, 'Address saved successfully');
  } catch (error) {
    return handleError(error, 'saveAddress');
  }
});

export const editAddress = onCall(async (request) => {
  try {
    const userId = assertAuthenticated(request);
    const d = request.data as { addressId?: string; updates?: Partial<SaveAddressInput> };
    if (!d?.addressId || !d?.updates) throw new Error('addressId and updates are required');

    const updated = await AddressService.editAddress(userId, d.addressId, d.updates);
    return createSuccessResponse(updated, 'Address updated successfully');
  } catch (error) {
    return handleError(error, 'editAddress');
  }
});

export const deleteAddress = onCall(async (request) => {
  try {
    const userId = assertAuthenticated(request);
    const addressId = (request.data as { addressId?: string })?.addressId;
    if (!addressId) throw new Error('addressId is required');

    await AddressService.deleteAddress(userId, addressId);
    return createSuccessResponse(null, 'Address deleted successfully');
  } catch (error) {
    return handleError(error, 'deleteAddress');
  }
});

export const listSavedAddresses = onCall(async (request) => {
  try {
    const userId = assertAuthenticated(request);
    const addresses = await AddressService.listSavedAddresses(userId);
    return createSuccessResponse(addresses);
  } catch (error) {
    return handleError(error, 'listSavedAddresses');
  }
});
