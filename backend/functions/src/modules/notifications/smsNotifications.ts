export class SmsNotificationSender {
  public static async sendSms(phone: string, text: string): Promise<void> {
    console.log(`[SmsNotificationSender] Sending SMS to ${phone}: ${text}`);
    // Integrated with Twilio / Fast2SMS in production
  }
}
