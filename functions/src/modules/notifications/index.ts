import * as admin from "firebase-admin";
import { db } from "../../config";

export interface SendBookingNotificationParams {
  userId: string;
  title: string;
  body: string;
  type?: "booking" | "payment" | "system";
  bookingId?: string;
}

export async function sendBookingNotificationInternal({
  userId,
  title,
  body,
  type = "booking",
  bookingId,
}: SendBookingNotificationParams) {
  const now = admin.firestore.FieldValue.serverTimestamp();

  // 1. Persist notification in `notifications/{notificationId}`
  const notifRef = db.collection("notifications").doc();
  const notifData = {
    id: notifRef.id,
    userId,
    title,
    body,
    type,
    bookingId: bookingId || null,
    read: false,
    createdAt: now,
  };

  await notifRef.set(notifData);

  // 2. Dispatch FCM Push Notification if user has fcmToken saved
  try {
    const userDoc = await db.collection("users").doc(userId).get();
    const fcmToken = userDoc.data()?.fcmToken;

    if (fcmToken) {
      await admin.messaging().send({
        token: fcmToken,
        notification: {
          title,
          body,
        },
        data: {
          bookingId: bookingId || "",
          type,
        },
      });
    }
  } catch (err: any) {
    // Non-blocking log if push token not present
    console.log(`Push notification dispatch skipped for ${userId}: ${err?.message}`);
  }

  return { success: true, notificationId: notifRef.id };
}
