"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviewDriverOnboarding = exports.sendBookingNotification = exports.approveDriver = exports.submitDriverApplication = exports.verifyPayment = exports.createPaymentOrder = exports.completeBooking = exports.updateDriverLocation = exports.updateTripStatus = exports.rejectBooking = exports.acceptBooking = exports.sendDriverRequest = exports.findNearbyDrivers = exports.calculateFare = exports.createBooking = void 0;
const https_1 = require("firebase-functions/v2/https");
const config_1 = require("./config");
const roles_1 = require("./middleware/roles");
const pricing_1 = require("./modules/pricing");
const matching_1 = require("./modules/matching");
const bookings_1 = require("./modules/bookings");
const tracking_1 = require("./modules/tracking");
const payments_1 = require("./modules/payments");
const drivers_1 = require("./modules/drivers");
const notifications_1 = require("./modules/notifications");
const REGION = config_1.config.region; // asia-south1 (Mumbai)
/**
 * 1. createBooking
 * Validates and creates a booking with authoritative server-side fare calculation
 */
exports.createBooking = (0, https_1.onCall)({ region: REGION }, async (request) => {
    if (!request.auth) {
        throw new https_1.HttpsError("unauthenticated", "Authentication required to create a booking.");
    }
    const { vehicleCategory, pickup, drop, items, helperCount, scheduledAt, distanceKm, paymentMethod } = request.data || {};
    if (!vehicleCategory || !pickup?.address || !drop?.address) {
        throw new https_1.HttpsError("invalid-argument", "Missing required booking details (vehicle, pickup, drop).");
    }
    try {
        return await (0, bookings_1.createBookingInternal)({
            customerId: request.auth.uid,
            vehicleCategory,
            pickup,
            drop,
            items,
            helperCount: Number(helperCount) || 0,
            scheduledAt: scheduledAt || null,
            distanceKm: Number(distanceKm) || 1,
            paymentMethod: paymentMethod || "cash",
        });
    }
    catch (err) {
        throw new https_1.HttpsError("internal", err?.message || "Failed to create booking.");
    }
});
/**
 * 2. calculateFare
 * Calculates price using server-side pricing rules
 */
exports.calculateFare = (0, https_1.onCall)({ region: REGION }, async (request) => {
    const { city, vehicleType, distanceKm, helperCount } = request.data || {};
    if (!vehicleType || distanceKm === undefined) {
        throw new https_1.HttpsError("invalid-argument", "vehicleType and distanceKm are required.");
    }
    try {
        return await (0, pricing_1.calculateFareInternal)({
            city: city || "Coimbatore",
            vehicleType,
            distanceKm: Number(distanceKm),
            helperCount: Number(helperCount) || 0,
        });
    }
    catch (err) {
        throw new https_1.HttpsError("internal", err?.message || "Fare calculation error.");
    }
});
/**
 * 3. findNearbyDrivers
 * Finds eligible drivers in the service area
 */
exports.findNearbyDrivers = (0, https_1.onCall)({ region: REGION }, async (request) => {
    if (!request.auth) {
        throw new https_1.HttpsError("unauthenticated", "Authentication required.");
    }
    const { vehicleCategory, latitude, longitude, radiusKm } = request.data || {};
    if (latitude === undefined || longitude === undefined) {
        throw new https_1.HttpsError("invalid-argument", "latitude and longitude are required.");
    }
    try {
        return await (0, matching_1.findNearbyDriversInternal)({
            vehicleCategory,
            latitude: Number(latitude),
            longitude: Number(longitude),
            radiusKm: Number(radiusKm) || 15,
        });
    }
    catch (err) {
        throw new https_1.HttpsError("internal", err?.message || "Error searching for drivers.");
    }
});
/**
 * 4. sendDriverRequest
 * Sends a job request to a driver
 */
exports.sendDriverRequest = (0, https_1.onCall)({ region: REGION }, async (request) => {
    if (!request.auth) {
        throw new https_1.HttpsError("unauthenticated", "Authentication required.");
    }
    const { bookingId, driverId } = request.data || {};
    if (!bookingId || !driverId) {
        throw new https_1.HttpsError("invalid-argument", "bookingId and driverId are required.");
    }
    try {
        return await (0, matching_1.sendDriverRequestInternal)(bookingId, driverId);
    }
    catch (err) {
        throw new https_1.HttpsError("failed-precondition", err?.message || "Failed to send driver request.");
    }
});
/**
 * 5. acceptBooking
 * Atomically assigns one driver using a Firestore transaction.
 * Guarantees that two drivers cannot accept the same booking simultaneously.
 */
exports.acceptBooking = (0, https_1.onCall)({ region: REGION }, async (request) => {
    if (!request.auth) {
        throw new https_1.HttpsError("unauthenticated", "Authentication required to accept jobs.");
    }
    const { bookingId } = request.data || {};
    const driverId = request.auth.uid;
    if (!bookingId) {
        throw new https_1.HttpsError("invalid-argument", "bookingId is required.");
    }
    try {
        return await (0, bookings_1.acceptBookingInternal)(bookingId, driverId);
    }
    catch (err) {
        throw new https_1.HttpsError("failed-precondition", err?.message || "Could not accept booking.");
    }
});
/**
 * 6. rejectBooking
 * Records rejection and updates candidate selection
 */
exports.rejectBooking = (0, https_1.onCall)({ region: REGION }, async (request) => {
    if (!request.auth) {
        throw new https_1.HttpsError("unauthenticated", "Authentication required.");
    }
    const { bookingId, reason } = request.data || {};
    const driverId = request.auth.uid;
    if (!bookingId) {
        throw new https_1.HttpsError("invalid-argument", "bookingId is required.");
    }
    try {
        return await (0, bookings_1.rejectBookingInternal)(bookingId, driverId, reason);
    }
    catch (err) {
        throw new https_1.HttpsError("internal", err?.message || "Failed to record rejection.");
    }
});
/**
 * 7. updateTripStatus
 * Validates and records trip progress milestones
 */
exports.updateTripStatus = (0, https_1.onCall)({ region: REGION }, async (request) => {
    if (!request.auth) {
        throw new https_1.HttpsError("unauthenticated", "Authentication required.");
    }
    const { bookingId, nextStatus, pickupOtp } = request.data || {};
    const driverId = request.auth.uid;
    if (!bookingId || !nextStatus) {
        throw new https_1.HttpsError("invalid-argument", "bookingId and nextStatus are required.");
    }
    try {
        return await (0, bookings_1.updateTripStatusInternal)(bookingId, driverId, nextStatus, pickupOtp);
    }
    catch (err) {
        throw new https_1.HttpsError("failed-precondition", err?.message || "Trip update failed.");
    }
});
/**
 * 8. updateDriverLocation
 * Saves authorised driver location
 */
exports.updateDriverLocation = (0, https_1.onCall)({ region: REGION }, async (request) => {
    if (!request.auth) {
        throw new https_1.HttpsError("unauthenticated", "Authentication required.");
    }
    const { latitude, longitude, bookingId, heading, speed } = request.data || {};
    const driverId = request.auth.uid;
    if (latitude === undefined || longitude === undefined) {
        throw new https_1.HttpsError("invalid-argument", "latitude and longitude are required.");
    }
    try {
        return await (0, tracking_1.updateDriverLocationInternal)({
            driverId,
            latitude: Number(latitude),
            longitude: Number(longitude),
            bookingId: bookingId || null,
            heading: Number(heading) || 0,
            speed: Number(speed) || 0,
        });
    }
    catch (err) {
        throw new https_1.HttpsError("internal", err?.message || "Failed to update driver coordinates.");
    }
});
/**
 * 9. completeBooking
 * Validates delivery proof and completes trip
 */
exports.completeBooking = (0, https_1.onCall)({ region: REGION }, async (request) => {
    if (!request.auth) {
        throw new https_1.HttpsError("unauthenticated", "Authentication required.");
    }
    const { bookingId, deliveryOtp, proofPhotoUrl } = request.data || {};
    const driverId = request.auth.uid;
    if (!bookingId) {
        throw new https_1.HttpsError("invalid-argument", "bookingId is required.");
    }
    try {
        return await (0, bookings_1.completeBookingInternal)(bookingId, driverId, deliveryOtp, proofPhotoUrl);
    }
    catch (err) {
        throw new https_1.HttpsError("failed-precondition", err?.message || "Failed to complete trip.");
    }
});
/**
 * 10. createPaymentOrder
 * Creates a payment order for the booking
 */
exports.createPaymentOrder = (0, https_1.onCall)({ region: REGION }, async (request) => {
    if (!request.auth) {
        throw new https_1.HttpsError("unauthenticated", "Authentication required.");
    }
    const { bookingId, amount, provider } = request.data || {};
    if (!bookingId || amount === undefined) {
        throw new https_1.HttpsError("invalid-argument", "bookingId and amount are required.");
    }
    try {
        return await (0, payments_1.createPaymentOrderInternal)({
            bookingId,
            customerId: request.auth.uid,
            amount: Number(amount),
            provider: provider || "cash",
        });
    }
    catch (err) {
        throw new https_1.HttpsError("internal", err?.message || "Failed to create payment order.");
    }
});
/**
 * 11. verifyPayment
 * Verifies payment provider signature and updates records
 */
exports.verifyPayment = (0, https_1.onCall)({ region: REGION }, async (request) => {
    if (!request.auth) {
        throw new https_1.HttpsError("unauthenticated", "Authentication required.");
    }
    const { paymentId, bookingId, providerPaymentId, signature } = request.data || {};
    if (!paymentId || !bookingId || !providerPaymentId) {
        throw new https_1.HttpsError("invalid-argument", "paymentId, bookingId, and providerPaymentId are required.");
    }
    try {
        return await (0, payments_1.verifyPaymentInternal)({
            paymentId,
            bookingId,
            providerPaymentId,
            signature,
        });
    }
    catch (err) {
        throw new https_1.HttpsError("failed-precondition", err?.message || "Payment verification failed.");
    }
});
/**
 * 12. submitDriverApplication
 * Creates a driver verification request with vehicle and document details
 */
exports.submitDriverApplication = (0, https_1.onCall)({ region: REGION }, async (request) => {
    if (!request.auth) {
        throw new https_1.HttpsError("unauthenticated", "Authentication required.");
    }
    const { fullName, phone, email, serviceAreas, vehicleType, registrationNumber, capacityKg, vehiclePhotos, documents, } = request.data || {};
    if (!fullName || !phone || !vehicleType || !registrationNumber) {
        throw new https_1.HttpsError("invalid-argument", "Missing driver or vehicle registration details.");
    }
    try {
        return await (0, drivers_1.submitDriverApplicationInternal)({
            userId: request.auth.uid,
            fullName,
            phone,
            email,
            serviceAreas,
            vehicleType,
            registrationNumber,
            capacityKg: Number(capacityKg) || 850,
            vehiclePhotos,
            documents,
        });
    }
    catch (err) {
        throw new https_1.HttpsError("internal", err?.message || "Failed to submit driver application.");
    }
});
/**
 * 13. approveDriver
 * Admin-only driver approval
 */
exports.approveDriver = (0, https_1.onCall)({ region: REGION }, async (request) => {
    if (!request.auth) {
        throw new https_1.HttpsError("unauthenticated", "Authentication required.");
    }
    // Enforce admin permission check
    try {
        await (0, roles_1.requireUserRole)(request.auth.uid, "admin");
    }
    catch {
        throw new https_1.HttpsError("permission-denied", "Admin role required to approve drivers.");
    }
    const { driverId, vehicleId, approved, rejectionReason } = request.data || {};
    if (!driverId || approved === undefined) {
        throw new https_1.HttpsError("invalid-argument", "driverId and approved boolean are required.");
    }
    try {
        return await (0, drivers_1.approveDriverInternal)({
            driverId,
            vehicleId,
            approved: Boolean(approved),
            rejectionReason,
        });
    }
    catch (err) {
        throw new https_1.HttpsError("internal", err?.message || "Driver approval failed.");
    }
});
/**
 * 14. sendBookingNotification
 * Sends relevant push and in-app notifications
 */
exports.sendBookingNotification = (0, https_1.onCall)({ region: REGION }, async (request) => {
    if (!request.auth) {
        throw new https_1.HttpsError("unauthenticated", "Authentication required.");
    }
    const { userId, title, body, type, bookingId } = request.data || {};
    if (!userId || !title || !body) {
        throw new https_1.HttpsError("invalid-argument", "userId, title, and body are required.");
    }
    try {
        return await (0, notifications_1.sendBookingNotificationInternal)({
            userId,
            title,
            body,
            type,
            bookingId,
        });
    }
    catch (err) {
        throw new https_1.HttpsError("internal", err?.message || "Failed to send notification.");
    }
});
/**
 * 15. reviewDriverOnboarding
 * Admin review for 12-step driver onboarding with 3-level approval & corrections
 */
exports.reviewDriverOnboarding = (0, https_1.onCall)({ region: REGION }, async (request) => {
    if (!request.auth) {
        throw new https_1.HttpsError("unauthenticated", "Authentication required.");
    }
    try {
        await (0, roles_1.requireUserRole)(request.auth.uid, "admin");
    }
    catch {
        throw new https_1.HttpsError("permission-denied", "Admin role required to review driver applications.");
    }
    const { driverId, decision, remarks, correctionSection, correctionDocument } = request.data || {};
    if (!driverId || !decision) {
        throw new https_1.HttpsError("invalid-argument", "driverId and decision (APPROVED, REJECTED, NEEDS_CORRECTION) are required.");
    }
    try {
        return await (0, drivers_1.reviewDriverOnboardingInternal)({
            adminUid: request.auth.uid,
            driverId,
            decision,
            remarks: remarks || `Application marked as ${decision}`,
            correctionSection,
            correctionDocument,
        });
    }
    catch (err) {
        throw new https_1.HttpsError("internal", err?.message || "Driver review failed.");
    }
});
//# sourceMappingURL=index.js.map