import { PaymentRepository } from './payment.repository';
import { AppError } from '../../common/errors/AppError';
import { getIsoTimestamp } from '../../common/utils/timestamps';

export class RefundManager {
  public static async processRefund(paymentId: string, reason: string) {
    const payment = await PaymentRepository.getById(paymentId);
    if (!payment) throw new AppError('not-found', 'Payment record not found');
    if (payment.status !== 'paid') {
      throw new AppError('failed-precondition', 'Can only refund payments in "paid" status');
    }

    await PaymentRepository.update(paymentId, {
      status: 'refunded',
      updatedAt: getIsoTimestamp(),
    });

    return { paymentId, status: 'refunded', reason };
  }
}
