import { db } from '../../config/firebase';
import { COLLECTIONS } from '../../config/collections';

export interface ReviewRecord {
  id: string;
  bookingId: string;
  reviewerId: string;
  targetUserId: string;
  rating: number;
  comment?: string;
  createdAt: string;
}

export class ReviewRepository {
  public static async create(review: ReviewRecord): Promise<void> {
    await db.collection(COLLECTIONS.REVIEWS).doc(review.id).set(review);
  }

  public static async getByTargetUser(targetUserId: string): Promise<ReviewRecord[]> {
    const snap = await db.collection(COLLECTIONS.REVIEWS).where('targetUserId', '==', targetUserId).get();
    return snap.docs.map((d) => d.data() as ReviewRecord);
  }
}
