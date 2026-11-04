import { onSchedule } from 'firebase-functions/v2/scheduler';
import { db } from '../../config/firebase';
import { COLLECTIONS } from '../../config/collections';

/**
 * Cleans up expired dispatch requests older than 24 hours.
 * Runs once every 24 hours.
 */
export const cleanupExpiredDispatchRequests = onSchedule('every 24 hours', async () => {
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  const snap = await db
    .collection(COLLECTIONS.DISPATCH_REQUESTS)
    .where('createdAt', '<=', yesterday)
    .limit(500)
    .get();

  const batch = db.batch();
  snap.docs.forEach((d) => batch.delete(d.ref));
  await batch.commit();

  console.log(`[cleanupExpiredDispatchRequests] Deleted ${snap.size} old dispatch requests.`);
});
