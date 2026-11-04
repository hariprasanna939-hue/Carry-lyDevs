import { messaging } from '../../config/firebase';

export interface PushNotificationPayload {
  title: string;
  body: string;
  data?: Record<string, string>;
}

export class PushNotificationSender {
  public static async sendToTokens(tokens: string[], payload: PushNotificationPayload): Promise<void> {
    if (!tokens.length) return;

    try {
      await messaging.sendEachForMulticast({
        tokens,
        notification: {
          title: payload.title,
          body: payload.body,
        },
        data: payload.data,
      });
    } catch (err) {
      console.error('[PushNotificationSender] Error sending FCM:', err);
    }
  }
}
