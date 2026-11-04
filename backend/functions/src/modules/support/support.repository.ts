import { db } from '../../config/firebase';
import { COLLECTIONS } from '../../config/collections';

export interface SupportTicket {
  id: string;
  userId: string;
  bookingId?: string;
  category: string;
  subject: string;
  description: string;
  evidenceUrls?: string[];
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  resolutionNote?: string;
  resolvedAt?: string;
  resolvedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export class SupportRepository {
  public static async create(ticket: SupportTicket): Promise<void> {
    await db.collection(COLLECTIONS.SUPPORT_TICKETS).doc(ticket.id).set(ticket);
  }

  public static async getById(ticketId: string): Promise<SupportTicket | null> {
    const doc = await db.collection(COLLECTIONS.SUPPORT_TICKETS).doc(ticketId).get();
    return doc.exists ? (doc.data() as SupportTicket) : null;
  }

  public static async getByUserId(userId: string): Promise<SupportTicket[]> {
    const snap = await db.collection(COLLECTIONS.SUPPORT_TICKETS).where('userId', '==', userId).get();
    return snap.docs.map((d) => d.data() as SupportTicket);
  }

  public static async update(ticketId: string, updates: Partial<SupportTicket>): Promise<void> {
    await db.collection(COLLECTIONS.SUPPORT_TICKETS).doc(ticketId).set(updates, { merge: true });
  }
}
