export type PaymentMethod = "cash" | "upi" | "card" | "razorpay" | "stripe";

export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

export interface PaymentRecord {
  id?: string;
  bookingId: string;
  customerId: string;
  amount: number; // In Rupees or Paise
  amountPaise?: number; // Alias
  provider: "cash" | "upi" | "razorpay" | "manual";
  providerPaymentId: string;
  paymentStatus: PaymentStatus;
  status?: PaymentStatus; // Alias
  method?: PaymentMethod; // Alias
  transactionRef?: string;
  createdAt: unknown;
}
