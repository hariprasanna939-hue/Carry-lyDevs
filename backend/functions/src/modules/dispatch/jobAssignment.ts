import { DispatchRepository, DispatchRequest } from './dispatch.repository';
import { generateId } from '../../common/utils/generateId';
import { getIsoTimestamp } from '../../common/utils/timestamps';
import { CONSTANTS } from '../../config/constants';
import { NotificationService } from '../notifications/notification.service';

export class JobAssignmentDispatcher {
  public static async sendJobRequestToDriver(bookingId: string, driverId: string): Promise<DispatchRequest> {
    const id = generateId('disp');
    const now = new Date();
    const expiresAt = new Date(now.getTime() + CONSTANTS.DRIVER_MAX_ACCEPT_TIME_SECONDS * 1000).toISOString();

    const dispatchReq: DispatchRequest = {
      id,
      bookingId,
      driverId,
      status: 'pending',
      expiresAt,
      createdAt: now.toISOString(),
    };

    await DispatchRepository.createRequest(dispatchReq);

    // Notify driver via Push Notification
    await NotificationService.sendToUser(driverId, {
      title: 'New Trip Request Available! 🚚',
      body: 'You have a new delivery request. Open CARRY to accept.',
      data: {
        type: 'TRIP_REQUEST',
        bookingId,
        dispatchRequestId: id,
        expiresAt,
      },
    });

    return dispatchReq;
  }
}
