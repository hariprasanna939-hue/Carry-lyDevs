import { onSchedule } from 'firebase-functions/v2/scheduler';
import { db } from '../../config/firebase';
import { COLLECTIONS } from '../../config/collections';
import { DispatchService } from '../dispatch/dispatch.service';

/**
 * Checks for scheduled bookings whose pickup time is within 30 minutes and triggers driver search.
 * Runs every 5 minutes.
 */
export const checkScheduledBookings = onSchedule('every 5 minutes', async () => {
  const now = Date.now();
  const threshold = new Date(now + 30 * 60 * 1000).toISOString();

  const snap = await db
    .collection(COLLECTIONS.BOOKINGS)
    .where('status', '==', 'created')
    .where('isScheduled', '==', true)
    .where('scheduledAt', '<=', threshold)
    .get();

  console.log(`[checkScheduledBookings] Found ${snap.size} scheduled bookings to dispatch.`);

  for (const doc of snap.docs) {
    await doc.ref.update({ status: 'searching' });
    await DispatchService.dispatchBookingToDrivers(doc.id);
  }
});
