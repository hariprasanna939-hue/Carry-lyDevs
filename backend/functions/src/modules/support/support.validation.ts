import { isNonEmptyString } from '../../common/validators';

export interface CreateTicketInput {
  bookingId?: string;
  category: 'trip_issue' | 'payment_issue' | 'driver_issue' | 'app_bug' | 'other';
  subject: string;
  description: string;
}

export function validateCreateTicketInput(data: unknown): {
  isValid: boolean;
  errors?: string[];
  value?: CreateTicketInput;
} {
  const d = data as Record<string, unknown> | null;
  const errors: string[] = [];

  if (!d) return { isValid: false, errors: ['Body is required'] };
  if (!isNonEmptyString(d.subject)) errors.push('subject is required');
  if (!isNonEmptyString(d.description)) errors.push('description is required');

  if (errors.length > 0) return { isValid: false, errors };

  return {
    isValid: true,
    value: {
      bookingId: typeof d.bookingId === 'string' ? d.bookingId : undefined,
      category: (d.category as CreateTicketInput['category']) || 'other',
      subject: (d.subject as string).trim(),
      description: (d.description as string).trim(),
    },
  };
}
