import { onSchedule } from 'firebase-functions/v2/scheduler';
import { db } from '../../config/firebase';
import { COLLECTIONS } from '../../config/collections';
import { getIsoTimestamp } from '../../common/utils/timestamps';

/**
 * Automatically marks bookings that have been searching for more than 15 minutes as cancelled/no-driver.
 * Runs every 5 minutes.
 */
export const cancelStaleSearchingBookings = onSchedule('every 5 minutes', async () => {
  const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000).toISOString();

  const snap = await db
    .collection(COLLECTIONS.BOOKINGS)
    .where('status', '==', 'searching')
    .where('createdAt', '<=', fifteenMinutesAgo)
    .get();

  console.log(`[cancelStaleSearchingBookings] Found ${snap.size} stale searching bookings.`);

  for (const doc of snap.docs) {
    await doc.ref.update({
      status: 'cancelled',
      cancelledBy: 'system',
      cancellationReason: 'No nearby drivers available at the moment',
      updatedAt: getIsoTimestamp(),
    });
  }
});
