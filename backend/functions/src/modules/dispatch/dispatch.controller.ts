import { onCall } from 'firebase-functions/v2/https';
import { assertAuthenticated } from '../../common/middleware/authenticate';
import { DispatchService } from './dispatch.service';
import { handleError } from '../../common/errors/errorHandler';
import { createSuccessResponse } from '../../common/types/ApiResponse';

/**
 * 14. findAvailableDrivers — Find compatible nearby drivers
 */
export const findAvailableDrivers = onCall(async (request) => {
  try {
    assertAuthenticated(request);
    const d = request.data as { latitude?: number; longitude?: number; radiusKm?: number } | null;
    if (typeof d?.latitude !== 'number' || typeof d?.longitude !== 'number') {
      throw new Error('Valid latitude and longitude are required');
    }
    const drivers = await DispatchService.findAvailableDrivers(d.latitude, d.longitude, d.radiusKm);
    return createSuccessResponse(drivers);
  } catch (error) {
    return handleError(error, 'findAvailableDrivers');
  }
});

export const findNearbyDrivers = findAvailableDrivers;

/**
 * 15. sendDriverJobOffers — Send job offers
 */
export const sendDriverJobOffers = onCall(async (request) => {
  try {
    assertAuthenticated(request);
    const d = request.data as { bookingId?: string; driverIds?: string[] };
    if (!d?.bookingId) throw new Error('bookingId is required');

    const result = await DispatchService.sendDriverJobOffers(d.bookingId, d.driverIds);
    return createSuccessResponse(result, 'Job offers dispatched');
  } catch (error) {
    return handleError(error, 'sendDriverJobOffers');
  }
});

export const sendJobRequest = onCall(async (request) => {
  try {
    assertAuthenticated(request);
    const d = request.data as { bookingId?: string; driverId?: string };
    if (!d?.bookingId || !d?.driverId) throw new Error('bookingId and driverId are required');

    const job = await DispatchService.sendJobRequest(d.bookingId, d.driverId);
    return createSuccessResponse(job, 'Job request sent to driver');
  } catch (error) {
    return handleError(error, 'sendJobRequest');
  }
});

/**
 * 16. respondToJobOffer — Accept/reject an offer
 */
export const respondToJobOffer = onCall(async (request) => {
  try {
    const driverId = assertAuthenticated(request);
    const d = request.data as { offerId?: string; action?: 'accept' | 'reject' };
    if (!d?.offerId || !d?.action || (d.action !== 'accept' && d.action !== 'reject')) {
      throw new Error('offerId and action ("accept" | "reject") are required');
    }

    const result = await DispatchService.respondToJobOffer(driverId, d.offerId, d.action);
    return createSuccessResponse(result, `Offer ${d.action}ed successfully`);
  } catch (error) {
    return handleError(error, 'respondToJobOffer');
  }
});

export const matchVehicleSize = onCall(async (request) => {
  try {
    assertAuthenticated(request);
    const bookingId = (request.data as { bookingId?: string })?.bookingId;
    if (!bookingId) throw new Error('bookingId is required');

    const matched = await DispatchService.matchVehicleSize(bookingId);
    return createSuccessResponse(matched);
  } catch (error) {
    return handleError(error, 'matchVehicleSize');
  }
});

export const assignDriver = onCall(async (request) => {
  try {
    const callerId = assertAuthenticated(request);
    const d = request.data as { bookingId?: string; driverId?: string };
    if (!d?.bookingId) throw new Error('bookingId is required');
    const driverId = d.driverId || callerId;

    const result = await DispatchService.assignDriver(d.bookingId, driverId);
    return createSuccessResponse(result, 'Driver assigned successfully');
  } catch (error) {
    return handleError(error, 'assignDriver');
  }
});

export const acceptBooking = onCall(async (request) => {
  try {
    const driverId = assertAuthenticated(request);
    const bookingId = (request.data as { bookingId?: string })?.bookingId;
    if (!bookingId) throw new Error('bookingId is required');

    const result = await DispatchService.acceptBooking(bookingId, driverId);
    return createSuccessResponse(result, 'Booking accepted successfully');
  } catch (error) {
    return handleError(error, 'acceptBooking');
  }
});

export const rejectBooking = onCall(async (request) => {
  try {
    const driverId = assertAuthenticated(request);
    const bookingId = (request.data as { bookingId?: string })?.bookingId;
    if (!bookingId) throw new Error('bookingId is required');

    const result = await DispatchService.rejectBooking(bookingId, driverId);
    return createSuccessResponse(result, 'Booking rejected');
  } catch (error) {
    return handleError(error, 'rejectBooking');
  }
});
