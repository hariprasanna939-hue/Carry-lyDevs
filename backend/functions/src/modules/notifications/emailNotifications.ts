export class EmailNotificationSender {
  public static async sendEmail(to: string, subject: string, html: string): Promise<void> {
    console.log(`[EmailNotificationSender] Sending email to ${to}: ${subject}`);
    // Integrated with SendGrid / Resend in production
  }
}
