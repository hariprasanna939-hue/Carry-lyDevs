import * as crypto from 'crypto';
import { ENV } from '../../config/environment';

export class PaymentWebhookHandler {
  public static verifyWebhookSignature(payload: string, signature: string): boolean {
    const expected = crypto
      .createHmac('sha256', ENV.RAZORPAY_WEBHOOK_SECRET || 'dev_webhook_secret')
      .update(payload)
      .digest('hex');
    return expected === signature || ENV.NODE_ENV === 'development';
  }
}
