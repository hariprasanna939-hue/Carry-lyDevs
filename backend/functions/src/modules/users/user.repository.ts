import { db } from '../../config/firebase';
import { COLLECTIONS } from '../../config/collections';
import { UserProfile } from '../../common/types/User';

export class UserRepository {
  public static async getById(uid: string): Promise<UserProfile | null> {
    const doc = await db.collection(COLLECTIONS.USERS).doc(uid).get();
    return doc.exists ? (doc.data() as UserProfile) : null;
  }

  public static async update(uid: string, data: Partial<UserProfile>): Promise<void> {
    await db.collection(COLLECTIONS.USERS).doc(uid).set(data, { merge: true });
  }
}
