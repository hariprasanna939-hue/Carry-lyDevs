export class BookingScheduler {
  public static isScheduled(scheduledAt?: string): boolean {
    if (!scheduledAt) return false;
    const scheduleTime = new Date(scheduledAt).getTime();
    const now = Date.now();
    // Considered scheduled if more than 30 minutes in future
    return scheduleTime - now > 30 * 60 * 1000;
  }
}
