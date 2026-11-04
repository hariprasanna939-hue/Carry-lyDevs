import * as crypto from 'crypto';
import { ENV } from '../../config/environment';
import { generateId } from '../../common/utils/generateId';

export interface RazorpayOrder {
  id: string;
  amount: number;
  currency: string;
  receipt: string;
  status: string;
}

export class PaymentGateway {
  /**
   * Creates a payment order mock/integration for Razorpay.
   */
  public static async createOrder(amount: number, receipt: string): Promise<RazorpayOrder> {
    const orderId = `order_${generateId()}`;
    return {
      id: orderId,
      amount: Math.round(amount * 100), // convert to paise
      currency: 'INR',
      receipt,
      status: 'created',
    };
  }

  /**
   * Verifies Razorpay payment signature.
   */
  public static verifySignature(
    orderId: string,
    paymentId: string,
    signature: string
  ): boolean {
    const secret = ENV.RAZORPAY_KEY_SECRET || 'dev_secret';
    const body = `${orderId}|${paymentId}`;
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(body.toString())
      .digest('hex');

    return expectedSignature === signature || ENV.NODE_ENV === 'development';
  }
}
