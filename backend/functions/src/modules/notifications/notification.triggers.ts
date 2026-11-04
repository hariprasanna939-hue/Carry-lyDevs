import { onDocumentCreated } from 'firebase-functions/v2/firestore';
import { COLLECTIONS } from '../../config/collections';

export const onNotificationCreated = onDocumentCreated(
  `${COLLECTIONS.NOTIFICATIONS}/{notifId}`,
  (event) => {
    const data = event.data?.data();
    if (data) {
      console.log(`[onNotificationCreated] Notification dispatched to user: ${data.userId}`);
    }
  }
);
