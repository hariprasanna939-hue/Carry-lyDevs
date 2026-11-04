import { onCall } from 'firebase-functions/v2/https';
import { assertAuthenticated } from '../../common/middleware/authenticate';
import { validateRequest } from '../../common/middleware/validateRequest';
import { validateCreateBookingInput } from './booking.validation';
import { BookingService } from './booking.service';
import { BookingRepository } from './booking.repository';
import { handleError } from '../../common/errors/errorHandler';
import { createSuccessResponse } from '../../common/types/ApiResponse';

/**
 * 9. createBooking — Create booking
 */
export const createBooking = onCall(async (request) => {
  try {
    const customerId = assertAuthenticated(request);
    const input = validateRequest(request.data, validateCreateBookingInput);
    const booking = await BookingService.createBooking(customerId, input);
    return createSuccessResponse(booking, 'Booking created successfully');
  } catch (error) {
    return handleError(error, 'createBooking');
  }
});

/**
 * 11. getBookingDetails — Get authorized booking details
 */
export const getBookingDetails = onCall(async (request) => {
  try {
    assertAuthenticated(request);
    const bookingId = (request.data as { bookingId?: string })?.bookingId;
    if (!bookingId) throw new Error('bookingId is required');
    const booking = await BookingService.getBookingById(bookingId);
    return createSuccessResponse(booking);
  } catch (error) {
    return handleError(error, 'getBookingDetails');
  }
});

export const getBooking = getBookingDetails;

/**
 * 12. cancelBooking — Cancel booking under policy
 */
export const cancelBooking = onCall(async (request) => {
  try {
    const userId = assertAuthenticated(request);
    const d = request.data as { bookingId?: string; reason?: string };
    if (!d?.bookingId) throw new Error('bookingId is required');
    const result = await BookingService.cancelBooking(d.bookingId, userId, d.reason);
    return createSuccessResponse(result, 'Booking cancelled');
  } catch (error) {
    return handleError(error, 'cancelBooking');
  }
});

/**
 * 13. getMyBookings — Get customer booking history
 */
export const getMyBookings = onCall(async (request) => {
  try {
    const userId = assertAuthenticated(request);
    const customerBookings = await BookingRepository.getCustomerBookings(userId);
    const driverBookings = await BookingRepository.getDriverBookings(userId);
    return createSuccessResponse([...customerBookings, ...driverBookings]);
  } catch (error) {
    return handleError(error, 'getMyBookings');
  }
});

export const listCustomerBookings = onCall(async (request) => {
  try {
    const customerId = assertAuthenticated(request);
    const bookings = await BookingService.listCustomerBookings(customerId);
    return createSuccessResponse(bookings);
  } catch (error) {
    return handleError(error, 'listCustomerBookings');
  }
});

export const rescheduleBooking = onCall(async (request) => {
  try {
    const customerId = assertAuthenticated(request);
    const d = request.data as { bookingId?: string; newScheduledAt?: string };
    if (!d?.bookingId || !d?.newScheduledAt) throw new Error('bookingId and newScheduledAt are required');

    const result = await BookingService.rescheduleBooking(customerId, d.bookingId, d.newScheduledAt);
    return createSuccessResponse(result, 'Booking rescheduled successfully');
  } catch (error) {
    return handleError(error, 'rescheduleBooking');
  }
});
