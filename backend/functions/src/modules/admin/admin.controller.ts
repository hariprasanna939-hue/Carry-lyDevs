import { onCall } from 'firebase-functions/v2/https';
import { requireAdmin } from '../../common/middleware/requireAdmin';
import { AdminService } from './admin.service';
import { handleError } from '../../common/errors/errorHandler';
import { createSuccessResponse } from '../../common/types/ApiResponse';

export const approveDriver = onCall(async (request) => {
  try {
    const adminId = await requireAdmin(request);
    const driverId = (request.data as { driverId?: string })?.driverId;
    if (!driverId) throw new Error('driverId is required');

    const result = await AdminService.approveDriver(adminId, driverId);
    return createSuccessResponse(result, 'Driver approved successfully');
  } catch (error) {
    return handleError(error, 'approveDriver');
  }
});

export const rejectDriver = onCall(async (request) => {
  try {
    const adminId = await requireAdmin(request);
    const d = request.data as { driverId?: string; reason?: string } | null;
    if (!d?.driverId || !d?.reason) throw new Error('driverId and reason are required');

    const result = await AdminService.rejectDriver(adminId, d.driverId, d.reason);
    return createSuccessResponse(result, 'Driver rejected');
  } catch (error) {
    return handleError(error, 'rejectDriver');
  }
});

export const adminCancelBooking = onCall(async (request) => {
  try {
    const adminId = await requireAdmin(request);
    const d = request.data as { bookingId?: string; reason?: string } | null;
    if (!d?.bookingId || !d?.reason) throw new Error('bookingId and reason are required');

    const result = await AdminService.cancelBooking(adminId, d.bookingId, d.reason);
    return createSuccessResponse(result, 'Booking cancelled by admin');
  } catch (error) {
    return handleError(error, 'adminCancelBooking');
  }
});

export const adminListBookings = onCall(async (request) => {
  try {
    const adminId = await requireAdmin(request);
    const status = (request.data as { status?: string })?.status;
    const bookings = await AdminService.listBookings(adminId, status);
    return createSuccessResponse(bookings);
  } catch (error) {
    return handleError(error, 'adminListBookings');
  }
});

export const adminSuspendUser = onCall(async (request) => {
  try {
    const adminId = await requireAdmin(request);
    const d = request.data as { targetUid?: string; reason?: string };
    if (!d?.targetUid || !d?.reason) throw new Error('targetUid and reason are required');

    const result = await AdminService.suspendUser(adminId, d.targetUid, d.reason);
    return createSuccessResponse(result, 'User suspended');
  } catch (error) {
    return handleError(error, 'adminSuspendUser');
  }
});

export const adminActivateUser = onCall(async (request) => {
  try {
    const adminId = await requireAdmin(request);
    const targetUid = (request.data as { targetUid?: string })?.targetUid;
    if (!targetUid) throw new Error('targetUid is required');

    const result = await AdminService.activateUser(adminId, targetUid);
    return createSuccessResponse(result, 'User activated');
  } catch (error) {
    return handleError(error, 'adminActivateUser');
  }
});

export const adminListUsers = onCall(async (request) => {
  try {
    const adminId = await requireAdmin(request);
    const role = (request.data as { role?: string })?.role;
    const users = await AdminService.listUsers(adminId, role);
    return createSuccessResponse(users);
  } catch (error) {
    return handleError(error, 'adminListUsers');
  }
});

export const adminUpdatePricing = onCall(async (request) => {
  try {
    const adminId = await requireAdmin(request);
    const d = request.data as { city?: string; pricing?: Record<string, unknown> };
    if (!d?.city || !d?.pricing) throw new Error('city and pricing are required');

    const result = await AdminService.updatePricing(adminId, d.city, d.pricing);
    return createSuccessResponse(result, 'Pricing updated');
  } catch (error) {
    return handleError(error, 'adminUpdatePricing');
  }
});

export const updatePricingConfig = adminUpdatePricing;

export const adminResolveDispute = onCall(async (request) => {
  try {
    const adminId = await requireAdmin(request);
    const d = request.data as { disputeId?: string; outcome?: string; refundAmount?: number };
    if (!d?.disputeId || !d?.outcome) throw new Error('disputeId and outcome are required');

    const result = await AdminService.resolveDispute(adminId, d.disputeId, d.outcome, d.refundAmount);
    return createSuccessResponse(result, 'Dispute resolved successfully');
  } catch (error) {
    return handleError(error, 'adminResolveDispute');
  }
});
