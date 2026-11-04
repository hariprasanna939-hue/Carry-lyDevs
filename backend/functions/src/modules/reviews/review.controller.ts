import { onCall } from 'firebase-functions/v2/https';
import { assertAuthenticated } from '../../common/middleware/authenticate';
import { validateRequest } from '../../common/middleware/validateRequest';
import { validateSubmitReviewInput } from './review.validation';
import { ReviewService } from './review.service';
import { handleError } from '../../common/errors/errorHandler';
import { createSuccessResponse } from '../../common/types/ApiResponse';

export const submitReview = onCall(async (request) => {
  try {
    const reviewerId = assertAuthenticated(request);
    const input = validateRequest(request.data, validateSubmitReviewInput);
    const review = await ReviewService.submitReview(reviewerId, input);
    return createSuccessResponse(review, 'Review submitted successfully');
  } catch (error) {
    return handleError(error, 'submitReview');
  }
});

export const reviewDriver = onCall(async (request) => {
  try {
    const customerId = assertAuthenticated(request);
    const d = request.data as { driverId?: string; bookingId?: string; rating?: number; comment?: string };
    if (!d?.driverId || !d?.bookingId || typeof d?.rating !== 'number') {
      throw new Error('driverId, bookingId, and rating are required');
    }
    const review = await ReviewService.reviewDriver(customerId, d.driverId, d.bookingId, d.rating, d.comment);
    return createSuccessResponse(review, 'Driver reviewed successfully');
  } catch (error) {
    return handleError(error, 'reviewDriver');
  }
});

export const getDriverRatingSummary = onCall(async (request) => {
  try {
    const driverId = (request.data as { driverId?: string })?.driverId;
    if (!driverId) throw new Error('driverId is required');
    const summary = await ReviewService.calculateRatings(driverId);
    return createSuccessResponse(summary);
  } catch (error) {
    return handleError(error, 'getDriverRatingSummary');
  }
});
