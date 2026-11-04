import { PushNotificationSender, PushNotificationPayload } from './pushNotifications';
import { NotificationRepository, AppNotification } from './notification.repository';
import { generateId } from '../../common/utils/generateId';
import { getIsoTimestamp } from '../../common/utils/timestamps';

export class NotificationService {
  /**
   * Generic Push Dispatch
   */
  public static async sendToUser(userId: string, payload: PushNotificationPayload): Promise<void> {
    const id = generateId('notif');
    const now = getIsoTimestamp();

    const notif: AppNotification = {
      id,
      userId,
      title: payload.title,
      body: payload.body,
      data: payload.data,
      read: false,
      createdAt: now,
    };

    await NotificationRepository.save(notif);

    const tokens = await NotificationRepository.getUserDeviceTokens(userId);
    if (tokens.length > 0) {
      await PushNotificationSender.sendToTokens(tokens, payload);
    }
  }

  /**
   * 1. Booking Updates
   */
  public static async sendBookingUpdate(userId: string, bookingId: string, statusText: string) {
    return this.sendToUser(userId, {
      title: 'Booking Update 📦',
      body: `Your delivery #${bookingId.slice(-6)} is now ${statusText}.`,
      data: { type: 'BOOKING_UPDATE', bookingId },
    });
  }

  /**
   * 2. Driver Requests
   */
  public static async sendDriverRequest(
    driverId: string,
    bookingId: string,
    vehicleType: string,
    pickupAddress: string
  ) {
    return this.sendToUser(driverId, {
      title: 'New Trip Request! 🚚',
      body: `New ${vehicleType} load at ${pickupAddress}. Tap to accept.`,
      data: { type: 'TRIP_REQUEST', bookingId },
    });
  }

  /**
   * 3. Reminders
   */
  public static async sendReminder(userId: string, bookingId: string, minutesRemaining: number) {
    return this.sendToUser(userId, {
      title: 'Scheduled Trip Reminder ⏰',
      body: `Your scheduled pickup will start in approximately ${minutesRemaining} minutes.`,
      data: { type: 'TRIP_REMINDER', bookingId },
    });
  }

  /**
   * 4. Payment Updates
   */
  public static async sendPaymentUpdate(userId: string, bookingId: string, amount: number, status: string) {
    return this.sendToUser(userId, {
      title: status === 'paid' ? 'Payment Successful! 💳' : 'Payment Update',
      body: `Payment of ₹${amount} for booking #${bookingId.slice(-6)} is ${status}.`,
      data: { type: 'PAYMENT_UPDATE', bookingId, status },
    });
  }

  public static async registerDeviceToken(userId: string, token: string): Promise<void> {
    await NotificationRepository.registerDeviceToken(userId, token);
  }
}
