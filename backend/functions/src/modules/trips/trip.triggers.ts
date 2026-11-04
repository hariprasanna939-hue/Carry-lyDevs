import { onDocumentUpdated } from 'firebase-functions/v2/firestore';
import { COLLECTIONS } from '../../config/collections';
import { Booking } from '../../common/types/Booking';
import { NotificationService } from '../notifications/notification.service';

export const onTripStatusChanged = onDocumentUpdated(
  `${COLLECTIONS.BOOKINGS}/{bookingId}`,
  async (event) => {
    const before = event.data?.before.data() as Booking | undefined;
    const after = event.data?.after.data() as Booking | undefined;
    const bookingId = event.params.bookingId;

    if (!before || !after) return;

    if (before.status !== after.status) {
      console.log(`[onTripStatusChanged] Booking ${bookingId} transitioned: ${before.status} -> ${after.status}`);

      let message = '';
      if (after.status === 'accepted') message = 'A driver has accepted your delivery order!';
      else if (after.status === 'arrived_at_pickup') message = 'Driver has arrived at your pickup location!';
      else if (after.status === 'in_transit') message = 'Your cargo is now in transit towards destination!';
      else if (after.status === 'completed') message = 'Your delivery is successfully completed. Thank you for choosing CARRY!';

      if (message) {
        await NotificationService.sendToUser(after.customerId, {
          title: 'Trip Update',
          body: message,
          data: { bookingId, status: after.status },
        });
      }
    }
  }
);
