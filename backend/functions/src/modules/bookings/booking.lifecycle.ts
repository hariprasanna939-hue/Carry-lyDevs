import { BookingStatus } from '../../common/types/Booking';
import { AppError } from '../../common/errors/AppError';

export const VALID_TRANSITIONS: Record<BookingStatus, BookingStatus[]> = {
  created: ['searching', 'cancelled'],
  searching: ['accepted', 'cancelled'],
  accepted: ['arrived_at_pickup', 'cancelled'],
  arrived_at_pickup: ['loading', 'cancelled'],
  loading: ['in_transit', 'cancelled'],
  in_transit: ['arrived_at_drop'],
  arrived_at_drop: ['unloading'],
  unloading: ['completed'],
  completed: [],
  cancelled: [],
};

export function validateStatusTransition(current: BookingStatus, next: BookingStatus): void {
  const allowed = VALID_TRANSITIONS[current] || [];
  if (!allowed.includes(next)) {
    throw new AppError(
      'failed-precondition',
      `Cannot transition booking status from "${current}" to "${next}".`
    );
  }
}
