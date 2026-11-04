import { Booking } from '../../common/types/Booking';
import { generateId } from '../../common/utils/generateId';

export interface Invoice {
  invoiceNumber: string;
  bookingId: string;
  customerId: string;
  date: string;
  items: { description: string; amount: number }[];
  subtotal: number;
  tax: number;
  total: number;
}

export class InvoiceGenerator {
  public static generateForBooking(booking: Booking): Invoice {
    const breakdown = booking.fareBreakdown;
    return {
      invoiceNumber: `INV-${generateId()}`.toUpperCase(),
      bookingId: booking.id,
      customerId: booking.customerId,
      date: new Date().toISOString(),
      items: [
        { description: 'Base Fare', amount: breakdown.baseFare },
        { description: 'Distance Charge', amount: breakdown.distanceFare },
        { description: 'Time Charge', amount: breakdown.timeFare },
        { description: 'Helper Assistance Fee', amount: breakdown.helperFee },
      ],
      subtotal: breakdown.baseFare + breakdown.distanceFare + breakdown.timeFare + breakdown.helperFee,
      tax: breakdown.tax,
      total: breakdown.total,
    };
  }
}
