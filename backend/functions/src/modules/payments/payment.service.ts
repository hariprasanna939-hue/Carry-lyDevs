import { PaymentGateway } from './payment.gateway';
import { PaymentRepository, PaymentRecord } from './payment.repository';
import { BookingRepository } from '../bookings/booking.repository';
import { InvoiceGenerator } from './invoices';
import { PaymentWebhookHandler } from './payment.webhook';
import { RefundManager } from './refunds';
import { AppError } from '../../common/errors/AppError';
import { generateId } from '../../common/utils/generateId';
import { getIsoTimestamp } from '../../common/utils/timestamps';
import { db } from '../../config/firebase';
import { COLLECTIONS } from '../../config/collections';

export class PaymentService {
  /**
   * 20. createPaymentOrder — Initiate payment
   */
  public static async createOrder(bookingId: string, customerId: string) {
    const booking = await BookingRepository.getById(bookingId);
    if (!booking) throw new AppError('not-found', 'Booking not found');

    const order = await PaymentGateway.createOrder(booking.totalFare, booking.id);
    const now = getIsoTimestamp();

    const record: PaymentRecord = {
      id: generateId('pay'),
      bookingId,
      customerId,
      amount: booking.totalFare,
      currency: 'INR',
      gatewayReference: order.id,
      orderId: order.id,
      status: 'pending',
      createdAt: now,
      updatedAt: now,
    };

    await PaymentRepository.create(record);
    return { ...order, paymentRecordId: record.id };
  }

  /**
   * 21. verifyPayment — Verify payment with gateway
   */
  public static async verifyPayment(
    bookingId: string,
    orderId: string,
    paymentId: string,
    signature: string
  ) {
    const isValid = PaymentGateway.verifySignature(orderId, paymentId, signature);
    if (!isValid) throw new AppError('invalid-argument', 'Invalid payment signature');

    const paymentRecord = await PaymentRepository.getByBookingId(bookingId);
    if (paymentRecord) {
      await PaymentRepository.update(paymentRecord.id, {
        status: 'paid',
        paymentId,
        gatewayReference: paymentId,
        signature,
        updatedAt: getIsoTimestamp(),
      });
    }

    await BookingRepository.update(bookingId, {
      paymentStatus: 'paid',
      updatedAt: getIsoTimestamp(),
    });

    return { verified: true, bookingId, paymentId };
  }

  /**
   * 22. processPaymentWebhook — Process trusted payment events
   */
  public static async processWebhook(rawBody: string, signature: string) {
    const isValid = PaymentWebhookHandler.verifyWebhookSignature(rawBody, signature);
    if (!isValid) {
      throw new AppError('permission-denied', 'Invalid webhook signature');
    }

    const event = JSON.parse(rawBody);
    console.log(`[PaymentService] Processing Razorpay webhook event: ${event.event}`);

    if (event.event === 'payment.captured') {
      const orderId = event.payload?.payment?.entity?.order_id;
      if (orderId) {
        const record = await PaymentRepository.getByOrderId(orderId);
        if (record) {
          await PaymentRepository.update(record.id, {
            status: 'paid',
            paymentId: event.payload.payment.entity.id,
            gatewayReference: event.payload.payment.entity.id,
            updatedAt: getIsoTimestamp(),
          });
          await BookingRepository.update(record.bookingId, {
            paymentStatus: 'paid',
            updatedAt: getIsoTimestamp(),
          });
        }
      }
    }

    return { received: true, event: event.event };
  }

  /**
   * 23. createRefund — Process authorized refund
   */
  public static async refundPayment(paymentId: string, reason: string) {
    return RefundManager.processRefund(paymentId, reason);
  }

  /**
   * 24. getDriverEarnings — Get driver's earnings
   */
  public static async getDriverEarnings(driverId: string) {
    const snap = await db
      .collection(COLLECTIONS.DRIVER_EARNINGS)
      .where('driverId', '==', driverId)
      .orderBy('createdAt', 'desc')
      .get();

    const earnings = snap.docs.map((d) => d.data());
    let totalGross = 0;
    let totalCommission = 0;
    let totalNet = 0;

    for (const e of earnings) {
      totalGross += Number(e.grossAmount) || 0;
      totalCommission += Number(e.commission) || 0;
      totalNet += Number(e.netAmount) || 0;
    }

    return {
      driverId,
      totalGross,
      totalCommission,
      totalNet,
      currency: 'INR',
      itemsCount: earnings.length,
      history: earnings,
    };
  }

  /**
   * Payment History
   */
  public static async getPaymentHistory(customerId: string): Promise<PaymentRecord[]> {
    return PaymentRepository.getUserPayments(customerId);
  }

  public static async getInvoice(bookingId: string) {
    const booking = await BookingRepository.getById(bookingId);
    if (!booking) throw new AppError('not-found', 'Booking not found');
    return InvoiceGenerator.generateForBooking(booking);
  }
}
