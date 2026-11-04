export interface SubmitReviewInput {
  bookingId: string;
  rating: number;
  comment?: string;
}

export function validateSubmitReviewInput(data: unknown): {
  isValid: boolean;
  errors?: string[];
  value?: SubmitReviewInput;
} {
  const d = data as Record<string, unknown> | null;
  const errors: string[] = [];

  if (!d) return { isValid: false, errors: ['Body is required'] };
  if (!d.bookingId || typeof d.bookingId !== 'string') errors.push('bookingId is required');
  if (typeof d.rating !== 'number' || d.rating < 1 || d.rating > 5) {
    errors.push('rating must be a number between 1 and 5');
  }

  if (errors.length > 0) return { isValid: false, errors };

  return {
    isValid: true,
    value: {
      bookingId: d.bookingId as string,
      rating: d.rating as number,
      comment: typeof d.comment === 'string' ? d.comment.trim() : undefined,
    },
  };
}
