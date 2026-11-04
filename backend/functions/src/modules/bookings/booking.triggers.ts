import { onDocumentCreated } from 'firebase-functions/v2/firestore';
import { COLLECTIONS } from '../../config/collections';
import { Booking } from '../../common/types/Booking';
import { DispatchService } from '../dispatch/dispatch.service';

export const onBookingCreated = onDocumentCreated(
  `${COLLECTIONS.BOOKINGS}/{bookingId}`,
  async (event) => {
    const booking = event.data?.data() as Booking | undefined;
    const bookingId = event.params.bookingId;

    if (!booking) return;

    // If immediate booking and searching, automatically trigger dispatch finder
    if (!booking.isScheduled && booking.status === 'searching') {
      try {
        console.log(`[onBookingCreated] Dispatching search for booking: ${bookingId}`);
        await DispatchService.dispatchBookingToDrivers(bookingId);
      } catch (err) {
        console.error(`[onBookingCreated] Failed to auto-dispatch booking ${bookingId}:`, err);
      }
    }
  }
);
