import { db } from '../../config/firebase';
import { COLLECTIONS } from '../../config/collections';

export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  body: string;
  data?: Record<string, unknown>;
  read: boolean;
  createdAt: string;
}

export class NotificationRepository {
  public static async save(notification: AppNotification): Promise<void> {
    await db.collection(COLLECTIONS.NOTIFICATIONS).doc(notification.id).set(notification);
  }

  public static async getUserDeviceTokens(userId: string): Promise<string[]> {
    const snap = await db.collection(COLLECTIONS.DEVICE_TOKENS).where('userId', '==', userId).get();
    return snap.docs.map((d) => d.data().token as string).filter(Boolean);
  }

  public static async registerDeviceToken(userId: string, token: string): Promise<void> {
    await db.collection(COLLECTIONS.DEVICE_TOKENS).doc(token).set({
      userId,
      token,
      updatedAt: new Date().toISOString(),
    });
  }
}
