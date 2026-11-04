import { onCall } from 'firebase-functions/v2/https';
import { requireAdmin } from '../../common/middleware/requireAdmin';
import { AnalyticsService } from './analytics.service';
import { handleError } from '../../common/errors/errorHandler';
import { createSuccessResponse } from '../../common/types/ApiResponse';

export const getBookingCounts = onCall(async (request) => {
  try {
    await requireAdmin(request);
    const counts = await AnalyticsService.getBookingCounts();
    return createSuccessResponse(counts);
  } catch (error) {
    return handleError(error, 'getBookingCounts');
  }
});

export const getActiveDrivers = onCall(async (request) => {
  try {
    await requireAdmin(request);
    const drivers = await AnalyticsService.getActiveDriversCount();
    return createSuccessResponse(drivers);
  } catch (error) {
    return handleError(error, 'getActiveDrivers');
  }
});

export const getRevenueSummary = onCall(async (request) => {
  try {
    await requireAdmin(request);
    const dateString = (request.data as { date?: string })?.date;
    const summary = await AnalyticsService.getRevenueSummary(dateString);
    return createSuccessResponse(summary);
  } catch (error) {
    return handleError(error, 'getRevenueSummary');
  }
});

export const getCancellationAndCompletionRates = onCall(async (request) => {
  try {
    await requireAdmin(request);
    const rates = await AnalyticsService.getCancellationAndCompletionRates();
    return createSuccessResponse(rates);
  } catch (error) {
    return handleError(error, 'getCancellationAndCompletionRates');
  }
});
