import { onCall } from 'firebase-functions/v2/https';
import { assertAuthenticated } from '../../common/middleware/authenticate';
import { TripService } from './trip.service';
import { BookingStatus } from '../../common/types/Booking';
import { handleError } from '../../common/errors/errorHandler';
import { createSuccessResponse } from '../../common/types/ApiResponse';

export const acceptTripJob = onCall(async (request) => {
  try {
    const driverId = assertAuthenticated(request);
    const bookingId = (request.data as { bookingId?: string })?.bookingId;
    if (!bookingId) throw new Error('bookingId is required');

    const result = await TripService.acceptJob(bookingId, driverId);
    return createSuccessResponse(result, 'Trip accepted successfully');
  } catch (error) {
    return handleError(error, 'acceptTripJob');
  }
});

/**
 * 17. startTrip — Start assigned trip
 */
export const startTrip = onCall(async (request) => {
  try {
    const driverId = assertAuthenticated(request);
    const bookingId = (request.data as { bookingId?: string })?.bookingId;
    if (!bookingId) throw new Error('bookingId is required');

    const result = await TripService.startTrip(bookingId, driverId);
    return createSuccessResponse(result, 'Trip started: In Transit');
  } catch (error) {
    return handleError(error, 'startTrip');
  }
});

export const markPickup = onCall(async (request) => {
  try {
    const driverId = assertAuthenticated(request);
    const d = request.data as { bookingId?: string; otp?: string };
    if (!d?.bookingId) throw new Error('bookingId is required');

    const result = await TripService.markPickup(d.bookingId, driverId, d.otp);
    return createSuccessResponse(result, 'Pickup marked and verified');
  } catch (error) {
    return handleError(error, 'markPickup');
  }
});

/**
 * 18. updateTripLocation — Update driver's location
 */
export const updateTripLocation = onCall(async (request) => {
  try {
    const driverId = assertAuthenticated(request);
    const d = request.data as { latitude?: number; longitude?: number; heading?: number; speed?: number } | null;
    if (typeof d?.latitude !== 'number' || typeof d?.longitude !== 'number') {
      throw new Error('Valid latitude and longitude are required');
    }
    const result = await TripService.updateDriverLocation(driverId, d.latitude, d.longitude, d.heading, d.speed);
    return createSuccessResponse(result, 'Location recorded');
  } catch (error) {
    return handleError(error, 'updateTripLocation');
  }
});

export const updateDriverLocation = updateTripLocation;

/**
 * 19. completeTrip — Complete trip
 */
export const completeTrip = onCall(async (request) => {
  try {
    const driverId = assertAuthenticated(request);
    const d = request.data as { bookingId?: string; otp?: string; deliveryProofUrl?: string };
    if (!d?.bookingId) throw new Error('bookingId is required');

    const result = await TripService.completeTrip(d.bookingId, driverId, d.otp, d.deliveryProofUrl);
    return createSuccessResponse(result, 'Trip completed successfully');
  } catch (error) {
    return handleError(error, 'completeTrip');
  }
});

export const updateTripStatus = onCall(async (request) => {
  try {
    const driverId = assertAuthenticated(request);
    const d = request.data as { bookingId?: string; status?: BookingStatus; otp?: string } | null;
    if (!d?.bookingId || !d?.status) {
      throw new Error('bookingId and status are required');
    }
    const result = await TripService.updateTripStatus(d.bookingId, driverId, d.status, d.otp);
    return createSuccessResponse(result, `Trip status updated to ${d.status}`);
  } catch (error) {
    return handleError(error, 'updateTripStatus');
  }
});
