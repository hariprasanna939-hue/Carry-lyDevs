import * as admin from "firebase-admin";
import { db } from "../../config";

export interface UpdateDriverLocationParams {
  driverId: string;
  latitude: number;
  longitude: number;
  bookingId?: string | null;
  heading?: number;
  speed?: number;
}

export async function updateDriverLocationInternal({
  driverId,
  latitude,
  longitude,
  bookingId = null,
  heading = 0,
  speed = 0,
}: UpdateDriverLocationParams) {
  if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
    throw new Error("Invalid GPS coordinates.");
  }

  const now = admin.firestore.FieldValue.serverTimestamp();

  await db.collection("driverLocations").doc(driverId).set(
    {
      driverId,
      latitude,
      longitude,
      bookingId,
      heading,
      speed,
      updatedAt: now,
    },
    { merge: true }
  );

  return { success: true, driverId, updatedAt: new Date() };
}
