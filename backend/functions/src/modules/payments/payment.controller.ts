import { onCall, onRequest } from 'firebase-functions/v2/https';
import { assertAuthenticated } from '../../common/middleware/authenticate';
import { PaymentService } from './payment.service';
import { handleError } from '../../common/errors/errorHandler';
import { createSuccessResponse } from '../../common/types/ApiResponse';

/**
 * 20. createPaymentOrder — Initiate payment
 */
export const createPaymentOrder = onCall(async (request) => {
  try {
    const customerId = assertAuthenticated(request);
    const bookingId = (request.data as { bookingId?: string })?.bookingId;
    if (!bookingId) throw new Error('bookingId is required');

    const order = await PaymentService.createOrder(bookingId, customerId);
    return createSuccessResponse(order);
  } catch (error) {
    return handleError(error, 'createPaymentOrder');
  }
});

/**
 * 21. verifyPayment — Verify payment with gateway
 */
export const verifyPayment = onCall(async (request) => {
  try {
    assertAuthenticated(request);
    const d = request.data as { bookingId?: string; orderId?: string; paymentId?: string; signature?: string } | null;
    if (!d?.bookingId || !d?.orderId || !d?.paymentId || !d?.signature) {
      throw new Error('bookingId, orderId, paymentId, and signature are required');
    }
    const result = await PaymentService.verifyPayment(d.bookingId, d.orderId, d.paymentId, d.signature);
    return createSuccessResponse(result, 'Payment verified successfully');
  } catch (error) {
    return handleError(error, 'verifyPayment');
  }
});

/**
 * 22. processPaymentWebhook — Process trusted payment events
 */
export const processPaymentWebhook = onRequest(async (req, res) => {
  try {
    const signature = req.headers['x-razorpay-signature'] as string;
    const rawBody = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
    const result = await PaymentService.processWebhook(rawBody, signature || '');
    res.status(200).json(result);
  } catch (error) {
    console.error('[processPaymentWebhook Error]:', error);
    res.status(400).json({ error: 'Webhook processing failed' });
  }
});

/**
 * 23. createRefund — Process authorized refund
 */
export const createRefund = onCall(async (request) => {
  try {
    assertAuthenticated(request);
    const d = request.data as { paymentId?: string; reason?: string };
    if (!d?.paymentId || !d?.reason) throw new Error('paymentId and reason are required');

    const result = await PaymentService.refundPayment(d.paymentId, d.reason);
    return createSuccessResponse(result, 'Refund processed successfully');
  } catch (error) {
    return handleError(error, 'createRefund');
  }
});

export const processRefund = createRefund;

/**
 * 24. getDriverEarnings — Get driver's earnings
 */
export const getDriverEarnings = onCall(async (request) => {
  try {
    const driverId = assertAuthenticated(request);
    const earnings = await PaymentService.getDriverEarnings(driverId);
    return createSuccessResponse(earnings);
  } catch (error) {
    return handleError(error, 'getDriverEarnings');
  }
});

export const getPaymentHistory = onCall(async (request) => {
  try {
    const customerId = assertAuthenticated(request);
    const history = await PaymentService.getPaymentHistory(customerId);
    return createSuccessResponse(history);
  } catch (error) {
    return handleError(error, 'getPaymentHistory');
  }
});

export const getInvoice = onCall(async (request) => {
  try {
    assertAuthenticated(request);
    const bookingId = (request.data as { bookingId?: string })?.bookingId;
    if (!bookingId) throw new Error('bookingId is required');
    const invoice = await PaymentService.getInvoice(bookingId);
    return createSuccessResponse(invoice);
  } catch (error) {
    return handleError(error, 'getInvoice');
  }
});
