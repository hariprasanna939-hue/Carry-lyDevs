"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.submitReview = submitReview;
const config_1 = require("../../config");
async function submitReview(bookingId, reviewerId, targetUserId, rating, comment) {
    const reviewRef = config_1.db.collection("reviews").doc();
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
//# sourceMappingURL=index.js.map