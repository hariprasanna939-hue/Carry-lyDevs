import { ReviewRepository, ReviewRecord } from './review.repository';
import { SubmitReviewInput } from './review.validation';
import { BookingRepository } from '../bookings/booking.repository';
import { DriverRepository } from '../drivers/driver.repository';
import { AppError } from '../../common/errors/AppError';
import { generateId } from '../../common/utils/generateId';
import { getIsoTimestamp } from '../../common/utils/timestamps';

export interface RatingSummary {
  averageRating: number;
  totalReviews: number;
  distribution: Record<number, number>;
}

export class ReviewService {
  /**
   * 1. Submit Rating
   */
  public static async submitReview(reviewerId: string, input: SubmitReviewInput): Promise<ReviewRecord> {
    const booking = await BookingRepository.getById(input.bookingId);
    if (!booking) throw new AppError('not-found', 'Booking not found');

    const targetUserId = booking.customerId === reviewerId ? booking.driverId : booking.customerId;
    if (!targetUserId) throw new AppError('failed-precondition', 'Target user for review not found');

    const record: ReviewRecord = {
      id: generateId('rev'),
      bookingId: input.bookingId,
      reviewerId,
      targetUserId,
      rating: input.rating,
      comment: input.comment,
      createdAt: getIsoTimestamp(),
    };

    await ReviewRepository.create(record);
    await this.calculateRatings(targetUserId);

    return record;
  }

  /**
   * 2. Review Driver
   */
  public static async reviewDriver(
    customerId: string,
    driverId: string,
    bookingId: string,
    rating: number,
    comment?: string
  ): Promise<ReviewRecord> {
    return this.submitReview(customerId, {
      bookingId,
      rating,
      comment,
    });
  }

  /**
   * 3. Calculate Ratings
   */
  public static async calculateRatings(driverId: string): Promise<RatingSummary> {
    const allReviews = await ReviewRepository.getByTargetUser(driverId);
    if (allReviews.length === 0) {
      return { averageRating: 5.0, totalReviews: 0, distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } };
    }

    const distribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    let sum = 0;

    for (const r of allReviews) {
      sum += r.rating;
      const rounded = Math.round(r.rating);
      if (distribution[rounded] !== undefined) distribution[rounded]++;
    }

    const avg = Math.round((sum / allReviews.length) * 10) / 10;

    // Update driver profile rating
    await DriverRepository.update(driverId, {
      rating: avg,
    });

    return {
      averageRating: avg,
      totalReviews: allReviews.length,
      distribution,
    };
  }
}
