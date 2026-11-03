import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { db } from "../../services/firebase";
import { DriverLocationUpdate } from "./tracking.types";

export const trackingService = {
  listenDriverLocation(driverId: string, onUpdate: (location: DriverLocationUpdate | null) => void) {
    return onSnapshot(doc(db, "driverLocations", driverId), (snap) => {
      if (!snap.exists()) {
        onUpdate(null);
      } else {
        const data = snap.data();
        onUpdate({
          latitude: data.latitude,
          longitude: data.longitude,
          bookingId: data.bookingId || null,
          heading: data.heading || 0,
          speed: data.speed || 0,
          updatedAt: data.updatedAt,
        });
      }
    });
  },

  async updateLocation(
    driverId: string,
    latitude: number,
    longitude: number,
    bookingId?: string | null,
    heading = 0
  ): Promise<void> {
    await setDoc(
      doc(db, "driverLocations", driverId),
      {
        latitude,
        longitude,
        bookingId: bookingId || null,
        heading,
        updatedAt: new Date(),
      },
      { merge: true }
    );
  },
};
