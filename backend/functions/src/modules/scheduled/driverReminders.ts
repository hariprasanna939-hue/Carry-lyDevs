import { onSchedule } from 'firebase-functions/v2/scheduler';
import { db } from '../../config/firebase';
import { COLLECTIONS } from '../../config/collections';
import { NotificationService } from '../notifications/notification.service';

/**
 * Sends reminders to drivers who have accepted trips scheduled within 15 minutes.
 * Runs every 10 minutes.
 */
export const sendDriverTripReminders = onSchedule('every 10 minutes', async () => {
  const now = Date.now();
  const threshold = new Date(now + 15 * 60 * 1000).toISOString();

  const snap = await db
    .collection(COLLECTIONS.BOOKINGS)
    .where('status', '==', 'accepted')
    .where('scheduledAt', '<=', threshold)
    .get();

  for (const doc of snap.docs) {
    const b = doc.data();
    if (b.driverId) {
      await NotificationService.sendToUser(b.driverId, {
        title: 'Upcoming Trip Reminder ⏰',
        body: `Pickup scheduled soon for customer: ${b.pickup?.contactName || 'Customer'}`,
        data: { bookingId: doc.id },
      });
    }
  }
});
