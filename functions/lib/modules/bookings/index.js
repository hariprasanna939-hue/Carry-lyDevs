"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBookingInternal = createBookingInternal;
exports.acceptBookingInternal = acceptBookingInternal;
exports.rejectBookingInternal = rejectBookingInternal;
exports.updateTripStatusInternal = updateTripStatusInternal;
exports.completeBookingInternal = completeBookingInternal;
const admin = __importStar(require("firebase-admin"));
const config_1 = require("../../config");
const utils_1 = require("../../utils");
const pricing_1 = require("../pricing");
async function createBookingInternal(input) {
    if (!input.pickup?.address || !input.drop?.address) {
        throw new Error("Pickup and drop-off addresses are required.");
    }
    // 1. Server-side authoritative fare calculation
    const fareResult = await (0, pricing_1.calculateFareInternal)({
        vehicleType: input.vehicleCategory,
        distanceKm: Math.max(1, input.distanceKm),
        helperCount: input.helperCount || 0,
    });
    const now = admin.firestore.FieldValue.serverTimestamp();
    const pickupOtp = (0, utils_1.generateOtp)(4);
    const deliveryOtp = (0, utils_1.generateOtp)(4);
    const docRef = config_1.db.collection("bookings").doc();
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
    await config_1.db.collection("bookingEvents").add({
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
async function acceptBookingInternal(bookingId, driverId) {
    const bookingRef = config_1.db.collection("bookings").doc(bookingId);
    const driverProfileRef = config_1.db.collection("driverProfiles").doc(driverId);
    const driverLocationRef = config_1.db.collection("driverLocations").doc(driverId);
    return await config_1.db.runTransaction(async (transaction) => {
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
        transaction.set(driverLocationRef, {
            driverId,
            bookingId,
            updatedAt: now,
        }, { merge: true });
        // 7. Write audit log
        const eventRef = config_1.db.collection("bookingEvents").doc();
        transaction.set(eventRef, {
            bookingId,
            eventType: "driver_assigned",
            description: `Driver ${driverData.fullName || driverId} accepted the booking`,
            createdBy: driverId,
            createdAt: now,
        });
        // 8. Notify customer that driver accepted
        if (bookingData.customerId) {
            const notifRef = config_1.db.collection("notifications").doc();
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
async function rejectBookingInternal(bookingId, driverId, reason) {
    const bookingRef = config_1.db.collection("bookings").doc(bookingId);
    const now = admin.firestore.FieldValue.serverTimestamp();
    await config_1.db.runTransaction(async (transaction) => {
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
        const eventRef = config_1.db.collection("bookingEvents").doc();
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
async function updateTripStatusInternal(bookingId, driverId, nextStatus, pickupOtpEntered) {
    const bookingRef = config_1.db.collection("bookings").doc(bookingId);
    const snap = await bookingRef.get();
    if (!snap.exists) {
        throw new Error("Booking not found");
    }
    const booking = snap.data();
    if (booking?.driverId !== driverId) {
        throw new Error("Unauthorized: Only the assigned driver can update trip status.");
    }
    // Validate milestone transition
    const validTransitions = {
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
    const updates = {
        bookingStatus: nextStatus,
        status: nextStatus,
        updatedAt: now,
    };
    if (nextStatus === "completed") {
        updates.completedAt = now;
    }
    await bookingRef.update(updates);
    // Audit event
    await config_1.db.collection("bookingEvents").add({
        bookingId,
        eventType: nextStatus,
        description: `Trip milestone progressed to ${nextStatus}`,
        createdBy: driverId,
        createdAt: now,
    });
    // Notify customer
    if (booking.customerId) {
        const statusMessages = {
            arrived_pickup: "Driver has arrived at the pickup location.",
            loading_started: "Goods loading has started.",
            in_transit: "Cargo loaded and driver is en route to destination.",
            delivered: "Driver has arrived at drop-off point.",
            completed: "Delivery complete! Thank you for using CARRY.",
        };
        await config_1.db.collection("notifications").add({
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
async function completeBookingInternal(bookingId, driverId, deliveryOtpEntered, proofPhotoUrl) {
    const bookingRef = config_1.db.collection("bookings").doc(bookingId);
    const driverProfileRef = config_1.db.collection("driverProfiles").doc(driverId);
    const driverLocRef = config_1.db.collection("driverLocations").doc(driverId);
    return await config_1.db.runTransaction(async (transaction) => {
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
        transaction.set(driverLocRef, {
            bookingId: null,
            updatedAt: now,
        }, { merge: true });
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
        const eventRef = config_1.db.collection("bookingEvents").doc();
        transaction.set(eventRef, {
            bookingId,
            eventType: "completed",
            description: "Booking completed and goods delivered successfully",
            createdBy: driverId,
            createdAt: now,
        });
        // 5. Notify customer
        if (booking.customerId) {
            const notifRef = config_1.db.collection("notifications").doc();
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
//# sourceMappingURL=index.js.map