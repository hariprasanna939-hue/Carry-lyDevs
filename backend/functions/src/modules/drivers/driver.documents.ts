import { db } from '../../config/firebase';
import { COLLECTIONS } from '../../config/collections';
import { DriverDocument } from './driver.types';
import { getIsoTimestamp } from '../../common/utils/timestamps';

export class DriverDocumentsManager {
  public static async saveDocuments(driverId: string, docs: Omit<DriverDocument, 'verified' | 'uploadedAt'>[]): Promise<void> {
    const batch = db.batch();
    const now = getIsoTimestamp();

    for (const doc of docs) {
      const docRef = db
        .collection(COLLECTIONS.DRIVER_DOCUMENTS)
        .doc(`${driverId}_${doc.type}`);

      batch.set(docRef, {
        ...doc,
        driverId,
        verified: false,
        uploadedAt: now,
      }, { merge: true });
    }

    await batch.commit();
  }

  public static async getDriverDocuments(driverId: string): Promise<DriverDocument[]> {
    const snap = await db
      .collection(COLLECTIONS.DRIVER_DOCUMENTS)
      .where('driverId', '==', driverId)
      .get();
    return snap.docs.map((d) => d.data() as DriverDocument);
  }
}
