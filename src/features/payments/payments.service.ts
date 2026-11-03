import { db } from "../../services/firebase";
import { collection, addDoc, updateDoc, doc } from "firebase/firestore";
import { PaymentRecord, PaymentStatus } from "../../types/payment";

export const paymentsService = {
  async initiatePayment(
    bookingId: string,
    customerId: string,
    amount: number,
    provider: "cash" | "upi" | "razorpay" = "cash"
  ): Promise<string> {
    const paymentDoc = await addDoc(collection(db, "payments"), {
      bookingId,
      customerId,
      amount,
      provider,
      providerPaymentId: `PAY-${Date.now()}`,
      paymentStatus: "pending" as PaymentStatus,
      createdAt: new Date(),
    });

    return paymentDoc.id;
  },

  async confirmPayment(
    paymentId: string,
    bookingId: string,
    providerPaymentId?: string
  ): Promise<void> {
    const updates: Record<string, any> = {
      paymentStatus: "paid",
      completedAt: new Date(),
    };
    if (providerPaymentId) {
      updates.providerPaymentId = providerPaymentId;
    }

    if (paymentId && paymentId !== "simulated_pay_id") {
      await updateDoc(doc(db, "payments", paymentId), updates);
    }

    await updateDoc(doc(db, "bookings", bookingId), {
      paymentStatus: "paid",
      updatedAt: new Date(),
    });
  },

  formatPaiseToRupees(paise: number): string {
    return `₹${(paise / 100).toLocaleString("en-IN")}`;
  },
};
