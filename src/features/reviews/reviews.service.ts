import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { db } from "../../services/firebase";
import { Review } from "./reviews.types";

export const reviewsService = {
  async addReview(review: Omit<Review, "id" | "createdAt">): Promise<string> {
    const docRef = await addDoc(collection(db, "reviews"), {
      bookingId: review.bookingId,
      customerId: review.customerId || review.reviewerId || "",
      driverId: review.driverId || review.targetUserId || "",
      rating: Math.min(5, Math.max(1, review.rating)),
      comment: review.comment || "",
      createdAt: new Date(),
    });
    return docRef.id;
  },

  async getDriverReviews(driverId: string): Promise<Review[]> {
    const q = query(collection(db, "reviews"), where("driverId", "==", driverId));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Review));
  },

  async getUserReviews(targetUserId: string): Promise<Review[]> {
    return this.getDriverReviews(targetUserId);
  },
};
