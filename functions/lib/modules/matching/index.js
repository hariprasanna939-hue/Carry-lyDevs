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
exports.findNearbyDriversInternal = findNearbyDriversInternal;
exports.sendDriverRequestInternal = sendDriverRequestInternal;
const admin = __importStar(require("firebase-admin"));
const config_1 = require("../../config");
const utils_1 = require("../../utils");
async function findNearbyDriversInternal({ vehicleCategory, latitude, longitude, radiusKm = 15, }) {
    // Query verified online drivers
    const driversSnap = await config_1.db
        .collection("driverProfiles")
        .where("verificationStatus", "==", "approved")
        .where("onlineStatus", "==", true)
        .limit(50)
        .get();
    if (driversSnap.empty) {
        return [];
    }
    const driverIds = driversSnap.docs.map((d) => d.id);
    // Fetch their latest known locations
    const locationRefs = driverIds.map((id) => config_1.db.collection("driverLocations").doc(id));
    const locationDocs = await config_1.db.getAll(...locationRefs);
    const results = [];
    for (let i = 0; i < driversSnap.docs.length; i++) {
        const driverDoc = driversSnap.docs[i];
        const driverData = driverDoc.data();
        const locDoc = locationDocs[i];
        if (!locDoc.exists)
            continue;
        const locData = locDoc.data();
        if (!locData || locData.latitude === undefined || locData.longitude === undefined)
            continue;
        // If driver is already on an active booking, skip them
        if (locData.bookingId)
            continue;
        const dist = (0, utils_1.calculateDistanceKm)(latitude, longitude, locData.latitude, locData.longitude);
        if (dist <= radiusKm) {
            results.push({
                driverId: driverDoc.id,
                fullName: driverData.fullName || "Partner Driver",
                phone: driverData.phone || "",
                rating: Number(driverData.rating) || 5.0,
                totalTrips: Number(driverData.totalTrips) || 0,
                distanceKm: dist,
                latitude: locData.latitude,
                longitude: locData.longitude,
            });
        }
    }
    // Sort by nearest distance
    results.sort((a, b) => a.distanceKm - b.distanceKm);
    return results;
}
async function sendDriverRequestInternal(bookingId, driverId) {
    const bookingRef = config_1.db.collection("bookings").doc(bookingId);
    const bookingSnap = await bookingRef.get();
    if (!bookingSnap.exists) {
        throw new Error("Booking not found");
    }
    const bookingData = bookingSnap.data();
    if (bookingData?.bookingStatus !== "searching") {
        throw new Error(`Cannot send request. Booking is already ${bookingData?.bookingStatus}`);
    }
    const now = admin.firestore.FieldValue.serverTimestamp();
    // Create notification for driver
    const notifRef = config_1.db.collection("notifications").doc();
    await notifRef.set({
        userId: driverId,
        title: "New Cargo Booking Request 🚚",
        body: `Pickup at ${bookingData.pickup?.address || "Coimbatore"}. Fare: ₹${bookingData.totalFare || ""}`,
        read: false,
        type: "booking",
        bookingId,
        createdAt: now,
    });
    // Record dispatch event
    await config_1.db.collection("bookingEvents").add({
        bookingId,
        eventType: "driver_requested",
        description: `Trip request dispatched to driver ${driverId}`,
        createdBy: "system",
        createdAt: now,
    });
    return { success: true, bookingId, driverId };
}
//# sourceMappingURL=index.js.map