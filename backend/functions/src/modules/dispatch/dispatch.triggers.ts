import { onDocumentUpdated } from 'firebase-functions/v2/firestore';
import { COLLECTIONS } from '../../config/collections';
import { DispatchRequest } from './dispatch.repository';
import { DispatchService } from './dispatch.service';

export const onDispatchRequestUpdated = onDocumentUpdated(
  `${COLLECTIONS.DISPATCH_REQUESTS}/{requestId}`,
  async (event) => {
    const after = event.data?.after.data() as DispatchRequest | undefined;
    if (!after) return;

    if (after.status === 'rejected' || after.status === 'expired') {
      console.log(`[onDispatchRequestUpdated] Request ${after.id} ended with ${after.status}. Retrying dispatch.`);
      await DispatchService.dispatchBookingToDrivers(after.bookingId);
    }
  }
);
