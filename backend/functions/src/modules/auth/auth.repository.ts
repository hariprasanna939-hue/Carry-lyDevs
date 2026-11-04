import { db, auth } from '../../config/firebase';
import { COLLECTIONS } from '../../config/collections';
import { UserProfile } from '../../common/types/User';

export class AuthRepository {
  public static async getUserDoc(uid: string): Promise<UserProfile | null> {
    const doc = await db.collection(COLLECTIONS.USERS).doc(uid).get();
    return doc.exists ? (doc.data() as UserProfile) : null;
  }

  public static async createUserDoc(profile: UserProfile): Promise<void> {
    await db.collection(COLLECTIONS.USERS).doc(profile.uid).set(profile, { merge: true });
  }

  public static async setCustomUserClaims(uid: string, claims: Record<string, unknown>): Promise<void> {
    await auth.setCustomUserClaims(uid, claims);
  }
}
