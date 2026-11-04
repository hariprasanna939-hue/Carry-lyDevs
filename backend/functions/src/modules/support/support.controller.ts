import { onCall } from 'firebase-functions/v2/https';
import { assertAuthenticated } from '../../common/middleware/authenticate';
import { validateRequest } from '../../common/middleware/validateRequest';
import { validateCreateTicketInput } from './support.validation';
import { SupportService } from './support.service';
import { handleError } from '../../common/errors/errorHandler';
import { createSuccessResponse } from '../../common/types/ApiResponse';

export const createSupportTicket = onCall(async (request) => {
  try {
    const userId = assertAuthenticated(request);
    const input = validateRequest(request.data, validateCreateTicketInput);
    const ticket = await SupportService.createTicket(userId, input);
    return createSuccessResponse(ticket, 'Support ticket created successfully');
  } catch (error) {
    return handleError(error, 'createSupportTicket');
  }
});

export const attachTicketEvidence = onCall(async (request) => {
  try {
    assertAuthenticated(request);
    const d = request.data as { ticketId?: string; evidenceUrls?: string[] };
    if (!d?.ticketId || !Array.isArray(d?.evidenceUrls)) {
      throw new Error('ticketId and evidenceUrls array are required');
    }
    const result = await SupportService.attachEvidence(d.ticketId, d.evidenceUrls);
    return createSuccessResponse(result, 'Evidence attached to ticket');
  } catch (error) {
    return handleError(error, 'attachTicketEvidence');
  }
});

export const trackSupportTicket = onCall(async (request) => {
  try {
    assertAuthenticated(request);
    const ticketId = (request.data as { ticketId?: string })?.ticketId;
    if (!ticketId) throw new Error('ticketId is required');

    const ticket = await SupportService.trackTicket(ticketId);
    return createSuccessResponse(ticket);
  } catch (error) {
    return handleError(error, 'trackSupportTicket');
  }
});

export const resolveSupportTicket = onCall(async (request) => {
  try {
    const adminId = assertAuthenticated(request);
    const d = request.data as { ticketId?: string; resolutionNote?: string };
    if (!d?.ticketId || !d?.resolutionNote) throw new Error('ticketId and resolutionNote are required');

    const result = await SupportService.resolveIssue(d.ticketId, d.resolutionNote, adminId);
    return createSuccessResponse(result, 'Support ticket resolved');
  } catch (error) {
    return handleError(error, 'resolveSupportTicket');
  }
});

export const getMySupportTickets = onCall(async (request) => {
  try {
    const userId = assertAuthenticated(request);
    const tickets = await SupportService.getUserTickets(userId);
    return createSuccessResponse(tickets);
  } catch (error) {
    return handleError(error, 'getMySupportTickets');
  }
});
