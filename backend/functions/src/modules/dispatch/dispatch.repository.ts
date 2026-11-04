import { db } from '../../config/firebase';
import { COLLECTIONS } from '../../config/collections';

export interface DispatchRequest {
  id: string;
  bookingId: string;
  driverId: string;
  status: 'pending' | 'accepted' | 'rejected' | 'expired';
  expiresAt: string;
  createdAt: string;
}

export class DispatchRepository {
  public static async createRequest(request: DispatchRequest): Promise<void> {
    // Write to driverJobOffers/{offerId}
    await db.collection(COLLECTIONS.DRIVER_JOB_OFFERS).doc(request.id).set(request);
    // Also mirror to legacy dispatchRequests/{offerId}
    await db.collection('dispatchRequests').doc(request.id).set(request);
  }

  public static async updateRequestStatus(
    requestId: string,
    status: DispatchRequest['status']
  ): Promise<void> {
    await db.collection(COLLECTIONS.DRIVER_JOB_OFFERS).doc(requestId).set({ status }, { merge: true });
    await db.collection('dispatchRequests').doc(requestId).set({ status }, { merge: true });
  }

  public static async getPendingForDriver(driverId: string): Promise<DispatchRequest[]> {
    const snap = await db
      .collection(COLLECTIONS.DRIVER_JOB_OFFERS)
      .where('driverId', '==', driverId)
      .where('status', '==', 'pending')
      .get();
    return snap.docs.map((d) => d.data() as DispatchRequest);
  }
}
