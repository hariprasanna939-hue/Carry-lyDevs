import * as admin from "firebase-admin";
import * as crypto from "crypto";
import { db } from "../../config";

export interface CreatePaymentOrderParams {
  bookingId: string;
  customerId: string;
  amount: number; // in Rupees
  provider: "cash" | "upi" | "razorpay";
}

export async function createPaymentOrderInternal({
  bookingId,
  customerId,
  amount,
  provider,
}: CreatePaymentOrderParams) {
  const bookingSnap = await db.collection("bookings").doc(bookingId).get();
  if (!bookingSnap.exists) {
    throw new Error("Booking not found");
  }

  const now = admin.firestore.FieldValue.serverTimestamp();
  const paymentRef = db.collection("payments").doc();

  // Generate simulated or real provider order ID
  const providerPaymentId = `order_${Date.now()}_${bookingId.slice(-4)}`;

  const paymentData = {
    id: paymentRef.id,
    bookingId,
    customerId,
    amount,
    provider,
    providerPaymentId,
    paymentStatus: provider === "cash" ? "pending" : "pending",
    createdAt: now,
  };

  await paymentRef.set(paymentData);

  return {
    success: true,
    paymentId: paymentRef.id,
    orderId: providerPaymentId,
    amount,
    currency: "INR",
    provider,
  };
}

export interface VerifyPaymentParams {
  paymentId: string;
  bookingId: string;
  providerPaymentId: string;
  signature?: string;
  secret?: string;
}

export async function verifyPaymentInternal({
  paymentId,
  bookingId,
  providerPaymentId,
  signature,
  secret,
}: VerifyPaymentParams) {
  const paymentRef = db.collection("payments").doc(paymentId);
  const bookingRef = db.collection("bookings").doc(bookingId);

  // If Razorpay HMAC signature is provided and secret configured, verify cryptographically
  if (signature && secret) {
    const generatedSignature = crypto
      .createHmac("sha256", secret)
      .update(`${bookingId}|${providerPaymentId}`)
      .digest("hex");

    if (generatedSignature !== signature) {
      throw new Error("Payment signature verification failed.");
    }
  }

  const now = admin.firestore.FieldValue.serverTimestamp();

  await db.runTransaction(async (transaction) => {
    transaction.update(paymentRef, {
      paymentStatus: "paid",
      providerPaymentId,
      completedAt: now,
    });

    transaction.update(bookingRef, {
      paymentStatus: "paid",
      paymentId,
      updatedAt: now,
    });

    const eventRef = db.collection("bookingEvents").doc();
    transaction.set(eventRef, {
      bookingId,
      eventType: "payment_received",
      description: `Payment of verified via ${providerPaymentId}`,
      createdBy: "system",
      createdAt: now,
    });
  });

  return { success: true, bookingId, paymentStatus: "paid" };
}
