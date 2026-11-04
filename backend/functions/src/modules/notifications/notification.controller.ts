import { onCall } from 'firebase-functions/v2/https';
import { assertAuthenticated } from '../../common/middleware/authenticate';
import { NotificationService } from './notification.service';
import { handleError } from '../../common/errors/errorHandler';
import { createSuccessResponse } from '../../common/types/ApiResponse';

/**
 * 25. registerPushToken — Register device notification token
 */
export const registerPushToken = onCall(async (request) => {
  try {
    const userId = assertAuthenticated(request);
    const token = (request.data as { token?: string })?.token;
    if (!token) throw new Error('token is required');

    await NotificationService.registerDeviceToken(userId, token);
    return createSuccessResponse(null, 'Device notification token registered');
  } catch (error) {
    return handleError(error, 'registerPushToken');
  }
});

export const registerDeviceToken = registerPushToken;

export const sendBookingNotification = onCall(async (request) => {
  try {
    assertAuthenticated(request);
    const d = request.data as { userId: string; bookingId: string; statusText: string };
    if (!d?.userId || !d?.bookingId || !d?.statusText) {
      throw new Error('userId, bookingId, and statusText are required');
    }
    await NotificationService.sendBookingUpdate(d.userId, d.bookingId, d.statusText);
    return createSuccessResponse(null, 'Booking notification sent');
  } catch (error) {
    return handleError(error, 'sendBookingNotification');
  }
});

export const sendDriverRequestNotification = onCall(async (request) => {
  try {
    assertAuthenticated(request);
    const d = request.data as { driverId: string; bookingId: string; vehicleType: string; pickupAddress: string };
    if (!d?.driverId || !d?.bookingId) throw new Error('driverId and bookingId are required');

    await NotificationService.sendDriverRequest(d.driverId, d.bookingId, d.vehicleType, d.pickupAddress);
    return createSuccessResponse(null, 'Driver request notification sent');
  } catch (error) {
    return handleError(error, 'sendDriverRequestNotification');
  }
});

export const sendTripReminderNotification = onCall(async (request) => {
  try {
    assertAuthenticated(request);
    const d = request.data as { userId: string; bookingId: string; minutesRemaining: number };
    if (!d?.userId || !d?.bookingId) throw new Error('userId and bookingId are required');

    await NotificationService.sendReminder(d.userId, d.bookingId, d.minutesRemaining || 15);
    return createSuccessResponse(null, 'Trip reminder notification sent');
  } catch (error) {
    return handleError(error, 'sendTripReminderNotification');
  }
});

export const sendPaymentNotification = onCall(async (request) => {
  try {
    assertAuthenticated(request);
    const d = request.data as { userId: string; bookingId: string; amount: number; status: string };
    if (!d?.userId || !d?.bookingId || typeof d?.amount !== 'number') {
      throw new Error('userId, bookingId, and amount are required');
    }

    await NotificationService.sendPaymentUpdate(d.userId, d.bookingId, d.amount, d.status || 'paid');
    return createSuccessResponse(null, 'Payment notification sent');
  } catch (error) {
    return handleError(error, 'sendPaymentNotification');
  }
});
