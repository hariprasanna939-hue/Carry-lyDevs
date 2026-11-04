import { BookingRepository } from '../bookings/booking.repository';
import { BookingCancellationService } from '../bookings/booking.cancellation';
import { AdminAuditLogger } from './admin.audit';

export class AdminBookingManagement {
  public static async cancelBookingByAdmin(adminId: string, bookingId: string, reason: string) {
    const result = await BookingCancellationService.cancelBooking(bookingId, 'admin', reason);
    await AdminAuditLogger.logAction(adminId, 'ADMIN_CANCEL_BOOKING', 'booking', bookingId, { reason });
    return result;
  }

  public static async getBookingDetails(bookingId: string) {
    return BookingRepository.getById(bookingId);
  }
}
