import * as admin from "firebase-admin";
import { db } from "../../config";
import { generateOtp } from "../../utils";
import { calculateFareInternal } from "../pricing";
import { LocationPoint, CargoItem } from "../../types";

export interface CreateBookingInput {
  customerId: string;
  vehicleCategory: string;
  pickup: LocationPoint;
  drop: LocationPoint;
  items?: CargoItem[];
  helperCount?: number;
  scheduledAt?: string | null;
  distanceKm: number;
  paymentMethod?: "cash" | "upi" | "card";
}

export async function createBookingInternal(input: CreateBookingInput) {
  if (!input.pickup?.address || !input.drop?.address) {
    throw new Error("Pickup and drop-off addresses are required.");
  }

  // 1. Server-side authoritative fare calculation
  const fareResult = await calculateFareInternal({
    vehicleType: input.vehicleCategory,
    distanceKm: Math.max(1, input.distanceKm),
    helperCount: input.helperCount || 0,
  });

  const now = admin.firestore.FieldValue.serverTimestamp();
  const pickupOtp = generateOtp(4);
  const deliveryOtp = generateOtp(4);

  const docRef = db.collection("bookings").doc();
  const newBooking = {
    id: docRef.id,
    customerId: input.customerId,
    driverId: null,
    vehicleId: null,
    vehicleCategory: input.vehicleCategory,
    pickup: input.pickup,
    drop: input.drop,
    dropoff: input.drop,
    items: input.items || [{ category: "General Cargo" }],
    cargo: (input.items && input.items[0]) || { category: "General Cargo" },
    helperCount: input.helperCount || 0,
    helpersCount: input.helperCount || 0,
    scheduledAt: input.scheduledAt || null,
    distanceKm: input.distanceKm,
    fareBreakdown: fareResult.fareBreakdown,
    fare: fareResult.fareBreakdown,
    totalFare: fareResult.totalFare,
    paymentStatus: "pending",
    bookingStatus: "searching",
    status: "searching",
    paymentMethod: input.paymentMethod || "cash",
    rejectedDriverIds: [],
    pickupOtp,
    deliveryOtp,
    createdAt: now,
    completedAt: null,
    updatedAt: now,
  };

  await docRef.set(newBooking);

  // 2. Audit Event in bookingEvents
  await db.collection("bookingEvents").add({
    bookingId: docRef.id,
    eventType: "created",
    description: `Booking created for vehicle category ${input.vehicleCategory}`,
    createdBy: input.customerId,
    createdAt: now,
  });

  return newBooking;
}

/**
 * CRITICAL: Atomically assigns a driver using a Firestore transaction.
 * Guarantees that two drivers cannot accept the same booking simultaneously.
 */
export async function acceptBookingInternal(bookingId: string, driverId: string) {
  const bookingRef = db.collection("bookings").doc(bookingId);
  const driverProfileRef = db.collection("driverProfiles").doc(driverId);
  const driverLocationRef = db.collection("driverLocations").doc(driverId);

  return await db.runTransaction(async (transaction) => {
    // 1. Read booking within transaction
    const bookingDoc = await transaction.get(bookingRef);
    if (!bookingDoc.exists) {
      throw new Error("Booking not found");
    }

    const bookingData = bookingDoc.data();
    if (!bookingData) {
      throw new Error("Corrupted booking document");
    }

    // 2. Check current status - must be searching
    if (bookingData.bookingStatus !== "searching" && bookingData.status !== "searching") {
      throw new Error(`Booking is no longer available. Status: ${bookingData.bookingStatus || bookingData.status}`);
    }

    // 3. Check if another driver was already assigned
    if (bookingData.driverId && bookingData.driverId !== driverId) {
      throw new Error("Booking has already been accepted by another driver.");
    }

    // 4. Validate driver is verified and online
    const driverDoc = await transaction.get(driverProfileRef);
    if (!driverDoc.exists) {
      throw new Error("Driver profile not found");
    }

    const driverData = driverDoc.data();
    if (driverData?.verificationStatus !== "approved") {
      throw new Error("Driver is not approved to accept bookings.");
    }

    const now = admin.firestore.FieldValue.serverTimestamp();

    // 5. Atomically assign driver
    transaction.update(bookingRef, {
      driverId,
      bookingStatus: "accepted",
      status: "accepted",
      acceptedAt: now,
      updatedAt: now,
    });

    // 6. Link driver location to this active booking
    transaction.set(
      driverLocationRef,
      {
        driverId,
        bookingId,
        updatedAt: now,
      },
      { merge: true }
    );

    // 7. Write audit log
    const eventRef = db.collection("bookingEvents").doc();
    transaction.set(eventRef, {
      bookingId,
      eventType: "driver_assigned",
      description: `Driver ${driverData.fullName || driverId} accepted the booking`,
      createdBy: driverId,
      createdAt: now,
    });

    // 8. Notify customer that driver accepted
    if (bookingData.customerId) {
      const notifRef = db.collection("notifications").doc();
      transaction.set(notifRef, {
        userId: bookingData.customerId,
        title: "Driver Assigned! 🚚",
        body: `${driverData.fullName || "A driver"} has accepted your booking and is heading to pickup.`,
        read: false,
        type: "booking",
        bookingId,
        createdAt: now,
      });
    }

    return {
      success: true,
      bookingId,
      driverId,
      status: "accepted",
      driverName: driverData.fullName || "Driver",
      driverPhone: driverData.phone || "",
    };
  });
}

export async function rejectBookingInternal(bookingId: string, driverId: string, reason?: string) {
  const bookingRef = db.collection("bookings").doc(bookingId);
  const now = admin.firestore.FieldValue.serverTimestamp();

  await db.runTransaction(async (transaction) => {
    const docSnap = await transaction.get(bookingRef);
    if (!docSnap.exists) {
      throw new Error("Booking not found");
    }

    const currentRejections = docSnap.data()?.rejectedDriverIds || [];
    const updatedRejections = Array.from(new Set([...currentRejections, driverId]));

    transaction.update(bookingRef, {
      rejectedDriverIds: updatedRejections,
      updatedAt: now,
    });

    const eventRef = db.collection("bookingEvents").doc();
    transaction.set(eventRef, {
      bookingId,
      eventType: "driver_rejected",
      description: `Driver ${driverId} rejected request: ${reason || "Not specified"}`,
      createdBy: driverId,
      createdAt: now,
    });
  });

  return { success: true, bookingId, driverId };
}

export async function updateTripStatusInternal(
  bookingId: string,
  driverId: string,
  nextStatus: string,
  pickupOtpEntered?: string
) {
  const bookingRef = db.collection("bookings").doc(bookingId);
  const snap = await bookingRef.get();
  if (!snap.exists) {
    throw new Error("Booking not found");
  }

  const booking = snap.data();
  if (booking?.driverId !== driverId) {
    throw new Error("Unauthorized: Only the assigned driver can update trip status.");
  }

  // Validate milestone transition
  const validTransitions: Record<string, string[]> = {
    accepted: ["arrived_pickup", "cancelled"],
    arrived_pickup: ["loading_started", "in_transit", "cancelled"],
    loading_started: ["in_transit", "cancelled"],
    in_transit: ["delivered", "completed"],
    delivered: ["completed"],
  };

  const allowed = validTransitions[booking.bookingStatus] || [];
  if (!allowed.includes(nextStatus)) {
    throw new Error(`Invalid status transition from ${booking.bookingStatus} to ${nextStatus}`);
  }

  // When moving to in_transit, verify OTP
  if (nextStatus === "in_transit") {
    if (booking.pickupOtp && pickupOtpEntered?.trim() !== booking.pickupOtp) {
      throw new Error("Invalid pickup OTP. Please request the 4-digit code from customer.");
    }
  }

  const now = admin.firestore.FieldValue.serverTimestamp();
  const updates: Record<string, any> = {
    bookingStatus: nextStatus,
    status: nextStatus,
    updatedAt: now,
  };

  if (nextStatus === "completed") {
    updates.completedAt = now;
  }

  await bookingRef.update(updates);

  // Audit event
  await db.collection("bookingEvents").add({
    bookingId,
    eventType: nextStatus,
    description: `Trip milestone progressed to ${nextStatus}`,
    createdBy: driverId,
    createdAt: now,
  });

  // Notify customer
  if (booking.customerId) {
    const statusMessages: Record<string, string> = {
      arrived_pickup: "Driver has arrived at the pickup location.",
      loading_started: "Goods loading has started.",
      in_transit: "Cargo loaded and driver is en route to destination.",
      delivered: "Driver has arrived at drop-off point.",
      completed: "Delivery complete! Thank you for using CARRY.",
    };

    await db.collection("notifications").add({
      userId: booking.customerId,
      title: "Trip Update",
      body: statusMessages[nextStatus] || `Your trip is now ${nextStatus}`,
      read: false,
      type: "booking",
      bookingId,
      createdAt: now,
    });
  }

  return { success: true, bookingId, nextStatus };
}

export async function completeBookingInternal(
  bookingId: string,
  driverId: string,
  deliveryOtpEntered?: string,
  proofPhotoUrl?: string
) {
  const bookingRef = db.collection("bookings").doc(bookingId);
  const driverProfileRef = db.collection("driverProfiles").doc(driverId);
  const driverLocRef = db.collection("driverLocations").doc(driverId);

  return await db.runTransaction(async (transaction) => {
    const bookingSnap = await transaction.get(bookingRef);
    if (!bookingSnap.exists) {
      throw new Error("Booking not found");
    }

    const booking = bookingSnap.data();
    if (!booking) {
      throw new Error("Corrupted booking document");
    }

    if (booking.driverId !== driverId) {
      throw new Error("Unauthorized: Only the assigned driver can complete this booking.");
    }

    // Verify delivery OTP if configured
    if (booking.deliveryOtp && deliveryOtpEntered && deliveryOtpEntered.trim() !== booking.deliveryOtp) {
      throw new Error("Invalid delivery OTP. Please verify delivery code with recipient.");
    }

    const now = admin.firestore.FieldValue.serverTimestamp();

    // 1. Mark booking completed
    transaction.update(bookingRef, {
      bookingStatus: "completed",
      status: "completed",
      proofPhotoUrl: proofPhotoUrl || null,
      completedAt: now,
      updatedAt: now,
    });

    // 2. Free driver from active trip
    transaction.set(
      driverLocRef,
      {
        bookingId: null,
        updatedAt: now,
      },
      { merge: true }
    );

    // 3. Increment driver's total trips
    const driverSnap = await transaction.get(driverProfileRef);
    if (driverSnap.exists) {
      const currentTrips = Number(driverSnap.data()?.totalTrips) || 0;
      transaction.update(driverProfileRef, {
        totalTrips: currentTrips + 1,
        updatedAt: now,
      });
    }

    // 4. Audit Event
    const eventRef = db.collection("bookingEvents").doc();
    transaction.set(eventRef, {
      bookingId,
      eventType: "completed",
      description: "Booking completed and goods delivered successfully",
      createdBy: driverId,
      createdAt: now,
    });

    // 5. Notify customer
    if (booking.customerId) {
      const notifRef = db.collection("notifications").doc();
      transaction.set(notifRef, {
        userId: booking.customerId,
        title: "Goods Delivered Successfully! 🎉",
        body: "Your cargo has been delivered. Please rate your experience.",
        read: false,
        type: "booking",
        bookingId,
        createdAt: now,
      });
    }

    return { success: true, bookingId, status: "completed" };
  });
}
