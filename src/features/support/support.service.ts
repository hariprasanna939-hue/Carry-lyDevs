import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { db } from "../../services/firebase";
import { SupportTicketDocument, SupportTicketStatus } from "../../types/support-ticket";

export const supportService = {
  async submitTicket(
    userId: string,
    issue: string,
    bookingId?: string | null
  ): Promise<string> {
    const docRef = await addDoc(collection(db, "supportTickets"), {
      userId,
      bookingId: bookingId || null,
      issue,
      status: "open" as SupportTicketStatus,
      createdAt: new Date(),
    });
    return docRef.id;
  },

  async getUserTickets(userId: string): Promise<SupportTicketDocument[]> {
    const q = query(collection(db, "supportTickets"), where("userId", "==", userId));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as SupportTicketDocument));
  },
};
