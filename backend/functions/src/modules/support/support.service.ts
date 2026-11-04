import { SupportRepository, SupportTicket } from './support.repository';
import { CreateTicketInput } from './support.validation';
import { generateId } from '../../common/utils/generateId';
import { getIsoTimestamp } from '../../common/utils/timestamps';
import { AppError } from '../../common/errors/AppError';

export class SupportService {
  /**
   * 1. Create Ticket
   */
  public static async createTicket(userId: string, input: CreateTicketInput): Promise<SupportTicket> {
    const id = generateId('ticket');
    const now = getIsoTimestamp();

    const ticket: SupportTicket = {
      id,
      userId,
      bookingId: input.bookingId,
      category: input.category,
      subject: input.subject,
      description: input.description,
      evidenceUrls: [],
      status: 'open',
      createdAt: now,
      updatedAt: now,
    };

    await SupportRepository.create(ticket);
    return ticket;
  }

  /**
   * 2. Attach Evidence
   */
  public static async attachEvidence(ticketId: string, evidenceUrls: string[]) {
    const ticket = await SupportRepository.getById(ticketId);
    if (!ticket) throw new AppError('not-found', 'Support ticket not found');

    const updatedUrls = Array.from(new Set([...(ticket.evidenceUrls || []), ...evidenceUrls]));
    await SupportRepository.update(ticketId, {
      evidenceUrls: updatedUrls,
      updatedAt: getIsoTimestamp(),
    });

    return { ticketId, evidenceUrls: updatedUrls };
  }

  /**
   * 3. Track Ticket
   */
  public static async trackTicket(ticketId: string): Promise<SupportTicket> {
    const ticket = await SupportRepository.getById(ticketId);
    if (!ticket) throw new AppError('not-found', 'Support ticket not found');
    return ticket;
  }

  /**
   * 4. Resolve Issue
   */
  public static async resolveIssue(ticketId: string, resolutionNote: string, resolvedBy: string) {
    const ticket = await SupportRepository.getById(ticketId);
    if (!ticket) throw new AppError('not-found', 'Support ticket not found');

    const now = getIsoTimestamp();
    const updates: Partial<SupportTicket> = {
      status: 'resolved',
      resolutionNote,
      resolvedBy,
      resolvedAt: now,
      updatedAt: now,
    };

    await SupportRepository.update(ticketId, updates);
    return { ...ticket, ...updates };
  }

  public static async getUserTickets(userId: string): Promise<SupportTicket[]> {
    return SupportRepository.getByUserId(userId);
  }
}
