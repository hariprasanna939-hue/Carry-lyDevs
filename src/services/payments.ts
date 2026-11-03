import { db } from "./firebase";
import { collection, addDoc, updateDoc, doc } from "firebase/firestore";
import { PaymentMethod, PaymentStatus } from "../types/payment";

export const paymentsService = {
  async initiatePayment(
    bookingId: string,
    customerId: string,
    amountPaise: number,
    method: PaymentMethod
  ): Promise<string> {
    const paymentDoc = await addDoc(collection(db, "payments"), {
      bookingId,
      customerId,
      amountPaise,
      method,
      status: "pending" as PaymentStatus,
      createdAt: new Date(),
    });

    return paymentDoc.id;
  },

  async confirmPayment(paymentId: string, bookingId: string): Promise<void> {
    await updateDoc(doc(db, "payments", paymentId), {
      status: "paid",
      completedAt: new Date(),
    });

    await updateDoc(doc(db, "bookings", bookingId), {
      paymentStatus: "paid",
      updatedAt: new Date(),
    });
  },
};
