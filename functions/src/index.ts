import { onCall, HttpsError } from "firebase-functions/v2/https";
import { config } from "./config";
import { requireUserRole } from "./middleware/roles";

import { calculateFareInternal } from "./modules/pricing";
import { findNearbyDriversInternal, sendDriverRequestInternal } from "./modules/matching";
import {
  createBookingInternal,
  acceptBookingInternal,
  rejectBookingInternal,
  updateTripStatusInternal,
  completeBookingInternal,
} from "./modules/bookings";
import { updateDriverLocationInternal } from "./modules/tracking";
import { createPaymentOrderInternal, verifyPaymentInternal } from "./modules/payments";
import {
  submitDriverApplicationInternal,
  approveDriverInternal,
  reviewDriverOnboardingInternal,
} from "./modules/drivers";
import { sendBookingNotificationInternal } from "./modules/notifications";

const REGION = config.region; // asia-south1 (Mumbai)

/**
 * 1. createBooking
 * Validates and creates a booking with authoritative server-side fare calculation
 */
export const createBooking = onCall({ region: REGION }, async (request) => {
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "Authentication required to create a booking.");
  }

  const { vehicleCategory, pickup, drop, items, helperCount, scheduledAt, distanceKm, paymentMethod } =
    request.data || {};

  if (!vehicleCategory || !pickup?.address || !drop?.address) {
    throw new HttpsError("invalid-argument", "Missing required booking details (vehicle, pickup, drop).");
  }

  try {
    return await createBookingInternal({
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
  } catch (err: any) {
    throw new HttpsError("internal", err?.message || "Failed to create booking.");
  }
});

/**
 * 2. calculateFare
 * Calculates price using server-side pricing rules
 */
export const calculateFare = onCall({ region: REGION }, async (request) => {
  const { city, vehicleType, distanceKm, helperCount } = request.data || {};

  if (!vehicleType || distanceKm === undefined) {
    throw new HttpsError("invalid-argument", "vehicleType and distanceKm are required.");
  }

  try {
    return await calculateFareInternal({
      city: city || "Coimbatore",
      vehicleType,
      distanceKm: Number(distanceKm),
      helperCount: Number(helperCount) || 0,
    });
  } catch (err: any) {
    throw new HttpsError("internal", err?.message || "Fare calculation error.");
  }
});

/**
 * 3. findNearbyDrivers
 * Finds eligible drivers in the service area
 */
export const findNearbyDrivers = onCall({ region: REGION }, async (request) => {
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "Authentication required.");
  }

  const { vehicleCategory, latitude, longitude, radiusKm } = request.data || {};

  if (latitude === undefined || longitude === undefined) {
    throw new HttpsError("invalid-argument", "latitude and longitude are required.");
  }

  try {
    return await findNearbyDriversInternal({
      vehicleCategory,
      latitude: Number(latitude),
      longitude: Number(longitude),
      radiusKm: Number(radiusKm) || 15,
    });
  } catch (err: any) {
    throw new HttpsError("internal", err?.message || "Error searching for drivers.");
  }
});

/**
 * 4. sendDriverRequest
 * Sends a job request to a driver
 */
export const sendDriverRequest = onCall({ region: REGION }, async (request) => {
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "Authentication required.");
  }

  const { bookingId, driverId } = request.data || {};

  if (!bookingId || !driverId) {
    throw new HttpsError("invalid-argument", "bookingId and driverId are required.");
  }

  try {
    return await sendDriverRequestInternal(bookingId, driverId);
  } catch (err: any) {
    throw new HttpsError("failed-precondition", err?.message || "Failed to send driver request.");
  }
});

/**
 * 5. acceptBooking
 * Atomically assigns one driver using a Firestore transaction.
 * Guarantees that two drivers cannot accept the same booking simultaneously.
 */
export const acceptBooking = onCall({ region: REGION }, async (request) => {
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "Authentication required to accept jobs.");
  }

  const { bookingId } = request.data || {};
  const driverId = request.auth.uid;

  if (!bookingId) {
    throw new HttpsError("invalid-argument", "bookingId is required.");
  }

  try {
    return await acceptBookingInternal(bookingId, driverId);
  } catch (err: any) {
    throw new HttpsError("failed-precondition", err?.message || "Could not accept booking.");
  }
});

/**
 * 6. rejectBooking
 * Records rejection and updates candidate selection
 */
export const rejectBooking = onCall({ region: REGION }, async (request) => {
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "Authentication required.");
  }

  const { bookingId, reason } = request.data || {};
  const driverId = request.auth.uid;

  if (!bookingId) {
    throw new HttpsError("invalid-argument", "bookingId is required.");
  }

  try {
    return await rejectBookingInternal(bookingId, driverId, reason);
  } catch (err: any) {
    throw new HttpsError("internal", err?.message || "Failed to record rejection.");
  }
});

/**
 * 7. updateTripStatus
 * Validates and records trip progress milestones
 */
export const updateTripStatus = onCall({ region: REGION }, async (request) => {
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "Authentication required.");
  }

  const { bookingId, nextStatus, pickupOtp } = request.data || {};
  const driverId = request.auth.uid;

  if (!bookingId || !nextStatus) {
    throw new HttpsError("invalid-argument", "bookingId and nextStatus are required.");
  }

  try {
    return await updateTripStatusInternal(bookingId, driverId, nextStatus, pickupOtp);
  } catch (err: any) {
    throw new HttpsError("failed-precondition", err?.message || "Trip update failed.");
  }
});

/**
 * 8. updateDriverLocation
 * Saves authorised driver location
 */
export const updateDriverLocation = onCall({ region: REGION }, async (request) => {
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "Authentication required.");
  }

  const { latitude, longitude, bookingId, heading, speed } = request.data || {};
  const driverId = request.auth.uid;

  if (latitude === undefined || longitude === undefined) {
    throw new HttpsError("invalid-argument", "latitude and longitude are required.");
  }

  try {
    return await updateDriverLocationInternal({
      driverId,
      latitude: Number(latitude),
      longitude: Number(longitude),
      bookingId: bookingId || null,
      heading: Number(heading) || 0,
      speed: Number(speed) || 0,
    });
  } catch (err: any) {
    throw new HttpsError("internal", err?.message || "Failed to update driver coordinates.");
  }
});

/**
 * 9. completeBooking
 * Validates delivery proof and completes trip
 */
export const completeBooking = onCall({ region: REGION }, async (request) => {
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "Authentication required.");
  }

  const { bookingId, deliveryOtp, proofPhotoUrl } = request.data || {};
  const driverId = request.auth.uid;

  if (!bookingId) {
    throw new HttpsError("invalid-argument", "bookingId is required.");
  }

  try {
    return await completeBookingInternal(bookingId, driverId, deliveryOtp, proofPhotoUrl);
  } catch (err: any) {
    throw new HttpsError("failed-precondition", err?.message || "Failed to complete trip.");
  }
});

/**
 * 10. createPaymentOrder
 * Creates a payment order for the booking
 */
export const createPaymentOrder = onCall({ region: REGION }, async (request) => {
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "Authentication required.");
  }

  const { bookingId, amount, provider } = request.data || {};

  if (!bookingId || amount === undefined) {
    throw new HttpsError("invalid-argument", "bookingId and amount are required.");
  }

  try {
    return await createPaymentOrderInternal({
      bookingId,
      customerId: request.auth.uid,
      amount: Number(amount),
      provider: provider || "cash",
    });
  } catch (err: any) {
    throw new HttpsError("internal", err?.message || "Failed to create payment order.");
  }
});

/**
 * 11. verifyPayment
 * Verifies payment provider signature and updates records
 */
export const verifyPayment = onCall({ region: REGION }, async (request) => {
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "Authentication required.");
  }

  const { paymentId, bookingId, providerPaymentId, signature } = request.data || {};

  if (!paymentId || !bookingId || !providerPaymentId) {
    throw new HttpsError("invalid-argument", "paymentId, bookingId, and providerPaymentId are required.");
  }

  try {
    return await verifyPaymentInternal({
      paymentId,
      bookingId,
      providerPaymentId,
      signature,
    });
  } catch (err: any) {
    throw new HttpsError("failed-precondition", err?.message || "Payment verification failed.");
  }
});

/**
 * 12. submitDriverApplication
 * Creates a driver verification request with vehicle and document details
 */
export const submitDriverApplication = onCall({ region: REGION }, async (request) => {
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "Authentication required.");
  }

  const {
    fullName,
    phone,
    email,
    serviceAreas,
    vehicleType,
    registrationNumber,
    capacityKg,
    vehiclePhotos,
    documents,
  } = request.data || {};

  if (!fullName || !phone || !vehicleType || !registrationNumber) {
    throw new HttpsError("invalid-argument", "Missing driver or vehicle registration details.");
  }

  try {
    return await submitDriverApplicationInternal({
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
  } catch (err: any) {
    throw new HttpsError("internal", err?.message || "Failed to submit driver application.");
  }
});

/**
 * 13. approveDriver
 * Admin-only driver approval
 */
export const approveDriver = onCall({ region: REGION }, async (request) => {
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "Authentication required.");
  }

  // Enforce admin permission check
  try {
    await requireUserRole(request.auth.uid, "admin");
  } catch {
    throw new HttpsError("permission-denied", "Admin role required to approve drivers.");
  }

  const { driverId, vehicleId, approved, rejectionReason } = request.data || {};

  if (!driverId || approved === undefined) {
    throw new HttpsError("invalid-argument", "driverId and approved boolean are required.");
  }

  try {
    return await approveDriverInternal({
      driverId,
      vehicleId,
      approved: Boolean(approved),
      rejectionReason,
    });
  } catch (err: any) {
    throw new HttpsError("internal", err?.message || "Driver approval failed.");
  }
});

/**
 * 14. sendBookingNotification
 * Sends relevant push and in-app notifications
 */
export const sendBookingNotification = onCall({ region: REGION }, async (request) => {
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "Authentication required.");
  }

  const { userId, title, body, type, bookingId } = request.data || {};

  if (!userId || !title || !body) {
    throw new HttpsError("invalid-argument", "userId, title, and body are required.");
  }

  try {
    return await sendBookingNotificationInternal({
      userId,
      title,
      body,
      type,
      bookingId,
    });
  } catch (err: any) {
    throw new HttpsError("internal", err?.message || "Failed to send notification.");
  }
});

/**
 * 15. reviewDriverOnboarding
 * Admin review for 12-step driver onboarding with 3-level approval & corrections
 */
export const reviewDriverOnboarding = onCall({ region: REGION }, async (request) => {
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "Authentication required.");
  }

  try {
    await requireUserRole(request.auth.uid, "admin");
  } catch {
    throw new HttpsError("permission-denied", "Admin role required to review driver applications.");
  }

  const { driverId, decision, remarks, correctionSection, correctionDocument } = request.data || {};

  if (!driverId || !decision) {
    throw new HttpsError("invalid-argument", "driverId and decision (APPROVED, REJECTED, NEEDS_CORRECTION) are required.");
  }

  try {
    return await reviewDriverOnboardingInternal({
      adminUid: request.auth.uid,
      driverId,
      decision,
      remarks: remarks || `Application marked as ${decision}`,
      correctionSection,
      correctionDocument,
    });
  } catch (err: any) {
    throw new HttpsError("internal", err?.message || "Driver review failed.");
  }
});
