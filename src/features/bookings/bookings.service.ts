import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  onSnapshot,
  addDoc,
} from "firebase/firestore";
import { db } from "../../services/firebase";
import { Booking } from "../../types/booking";

export const bookingsService = {
  async createBooking(bookingInput: Partial<Booking>): Promise<string> {
    const docRef = doc(collection(db, "bookings"));
    const now = new Date();

    const pickup = bookingInput.pickup || {
      address: "Coimbatore",
      latitude: 11.0168,
      longitude: 76.9558,
    };
    const drop = bookingInput.drop || bookingInput.dropoff || {
      address: "Coimbatore",
      latitude: 11.0285,
      longitude: 77.0275,
    };
    const items = bookingInput.items || (bookingInput.cargo ? [bookingInput.cargo] : []);
    const helperCount = bookingInput.helperCount ?? bookingInput.helpersCount ?? 0;
    const distanceKm = bookingInput.distanceKm ?? bookingInput.estimatedDistanceKm ?? 5;
    const fare = bookingInput.fareBreakdown || bookingInput.fare || {
      baseFarePaise: 35000,
      distanceFarePaise: 14000,
      helperFarePaise: 0,
      tollFarePaise: 0,
      totalFarePaise: 49000,
    };
    const totalFare = bookingInput.totalFare ?? Math.round(fare.totalFarePaise / 100);

    const newBooking: Booking = {
      id: docRef.id,
      customerId: bookingInput.customerId || "guest",
      driverId: bookingInput.driverId || "",
      vehicleId: bookingInput.vehicleId || "",
      vehicleCategory: bookingInput.vehicleCategory || "tata_ace",
      pickup,
      drop,
      dropoff: drop,
      items,
      cargo: items[0] || { category: "General Goods" },
      helperCount,
      helpersCount: helperCount,
      scheduledAt: bookingInput.scheduledAt || null,
      scheduledTime: bookingInput.scheduledTime,
      distanceKm,
      fareBreakdown: fare,
      fare,
      totalFare,
      paymentStatus: bookingInput.paymentStatus || "pending",
      bookingStatus: "searching",
      status: "searching",
      paymentMethod: bookingInput.paymentMethod || "cash",
      pickupOtp: Math.floor(1000 + Math.random() * 9000).toString(),
      deliveryOtp: Math.floor(1000 + Math.random() * 9000).toString(),
      createdAt: now,
      completedAt: null,
      updatedAt: now,
    };

    await setDoc(docRef, newBooking);

    // Also record initial booking event in bookingEvents/{eventId}
    await addDoc(collection(db, "bookingEvents"), {
      bookingId: docRef.id,
      eventType: "created",
      description: "Booking requested by customer",
      createdBy: bookingInput.customerId || "guest",
      createdAt: now,
    });

    return docRef.id;
  },

  async getBooking(bookingId: string): Promise<Booking | null> {
    const snap = await getDoc(doc(db, "bookings", bookingId));
    if (!snap.exists()) return null;
    return { id: snap.id, ...snap.data() } as Booking;
  },

  listenBooking(bookingId: string, onChange: (booking: Booking | null) => void) {
    return onSnapshot(doc(db, "bookings", bookingId), (snap) => {
      if (!snap.exists()) {
        onChange(null);
      } else {
        onChange({ id: snap.id, ...snap.data() } as Booking);
      }
    });
  },

  async updateBookingStatus(
    bookingId: string,
    status: Booking["status"],
    actorId = "system"
  ): Promise<void> {
    const updates: Record<string, any> = {
      bookingStatus: status,
      status,
      updatedAt: new Date(),
    };
    if (status === "completed") {
      updates.completedAt = new Date();
    }
    await updateDoc(doc(db, "bookings", bookingId), updates);

    // Record lifecycle milestone in bookingEvents
    await addDoc(collection(db, "bookingEvents"), {
      bookingId,
      eventType: status,
      description: `Trip status updated to ${status}`,
      createdBy: actorId,
      createdAt: new Date(),
    });
  },

  async cancelBooking(bookingId: string, reason?: string, actorId = "customer"): Promise<void> {
    await updateDoc(doc(db, "bookings", bookingId), {
      bookingStatus: "cancelled",
      status: "cancelled",
      cancellationReason: reason || "User cancelled",
      updatedAt: new Date(),
    });

    await addDoc(collection(db, "bookingEvents"), {
      bookingId,
      eventType: "cancelled",
      description: `Booking cancelled: ${reason || "No reason given"}`,
      createdBy: actorId,
      createdAt: new Date(),
    });
  },
};
