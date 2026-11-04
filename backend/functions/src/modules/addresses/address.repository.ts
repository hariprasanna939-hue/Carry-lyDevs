import { db } from '../../config/firebase';
import { COLLECTIONS } from '../../config/collections';

export interface SavedAddress {
  id: string;
  userId: string;
  label: string;
  address: string;
  landmark?: string;
  latitude: number;
  longitude: number;
  contactName?: string;
  contactPhone?: string;
  createdAt: string;
}

export class AddressRepository {
  public static async save(addr: SavedAddress): Promise<void> {
    await db.collection(COLLECTIONS.SAVED_ADDRESSES).doc(addr.id).set(addr);
  }

  public static async getByUserId(userId: string): Promise<SavedAddress[]> {
    const snap = await db.collection(COLLECTIONS.SAVED_ADDRESSES).where('userId', '==', userId).get();
    return snap.docs.map((d) => d.data() as SavedAddress);
  }

  public static async delete(id: string): Promise<void> {
    await db.collection(COLLECTIONS.SAVED_ADDRESSES).doc(id).delete();
  }
}
