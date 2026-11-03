import { db } from "../../config";

export async function submitReview(
  bookingId: string,
  reviewerId: string,
  targetUserId: string,
  rating: number,
  comment?: string
) {
  const reviewRef = db.collection("reviews").doc();
  await reviewRef.set({
    id: reviewRef.id,
    bookingId,
    reviewerId,
    targetUserId,
    rating: Math.min(5, Math.max(1, rating)),
    comment: comment || "",
    createdAt: new Date(),
  });
}
