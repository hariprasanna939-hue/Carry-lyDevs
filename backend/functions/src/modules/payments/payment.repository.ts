import { db } from '../../config/firebase';
import { COLLECTIONS } from '../../config/collections';

export interface PaymentRecord {
  id: string;
  bookingId: string;
  customerId: string;
  amount: number;
  currency: string;
  gatewayReference: string; // Razorpay orderId or paymentId
  status: 'pending' | 'paid' | 'failed' | 'refunded';
  orderId?: string;
  paymentId?: string;
  signature?: string;
  refundReason?: string;
  createdAt: string;
  updatedAt: string;
}

export class PaymentRepository {
  public static async create(record: PaymentRecord): Promise<void> {
    await db.collection(COLLECTIONS.PAYMENTS).doc(record.id).set(record);
  }

  public static async getById(paymentId: string): Promise<PaymentRecord | null> {
    const doc = await db.collection(COLLECTIONS.PAYMENTS).doc(paymentId).get();
    return doc.exists ? (doc.data() as PaymentRecord) : null;
  }

  public static async getByBookingId(bookingId: string): Promise<PaymentRecord | null> {
    const snap = await db.collection(COLLECTIONS.PAYMENTS).where('bookingId', '==', bookingId).limit(1).get();
    return snap.empty ? null : (snap.docs[0].data() as PaymentRecord);
  }

  public static async getByOrderId(orderId: string): Promise<PaymentRecord | null> {
    const snap = await db.collection(COLLECTIONS.PAYMENTS).where('gatewayReference', '==', orderId).limit(1).get();
    if (!snap.empty) return snap.docs[0].data() as PaymentRecord;
    const snap2 = await db.collection(COLLECTIONS.PAYMENTS).where('orderId', '==', orderId).limit(1).get();
    return snap2.empty ? null : (snap2.docs[0].data() as PaymentRecord);
  }

  public static async getUserPayments(customerId: string): Promise<PaymentRecord[]> {
    const snap = await db
      .collection(COLLECTIONS.PAYMENTS)
      .where('customerId', '==', customerId)
      .orderBy('createdAt', 'desc')
      .limit(50)
      .get();
    return snap.docs.map((d) => d.data() as PaymentRecord);
  }

  public static async update(paymentId: string, updates: Partial<PaymentRecord>): Promise<void> {
    await db.collection(COLLECTIONS.PAYMENTS).doc(paymentId).update(updates);
  }
}
