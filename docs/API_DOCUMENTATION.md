# CARRY — Cloud Functions & Backend API Specification

All sensitive operations are handled via Firebase Cloud Functions (TypeScript) using `onCall` or HTTPS triggers.

## 1. Authentication & Profile Endpoints
- `applyForDriver`: Submits driver application with verification payloads.
- `approveDriver` *(Admin only)*: Verifies driver KYC documents and updates `verificationStatus` to `approved`.
- `switchPortal`: Validates user role credentials before switching active portal.

## 2. Booking & Pricing Endpoints
- `calculateFare`: Takes pickup, drop, vehicle category, and helper requirements; returns integer paise fare breakdown using active `pricingConfigurations`.
- `createBooking`: Validates service area geofence (Coimbatore), calculates official fare, and creates Firestore booking record in `searching_driver` state.
- `cancelBooking`: Handles customer or driver cancellation with reason and cancellation fee calculation.

## 3. Dispatch & Matching Endpoints
- `findNearbyDrivers`: Discovers online, approved drivers in the Coimbatore cluster with compatible vehicles.
- `acceptBookingOffer`: **Atomic transaction** assigning the booking to the first driver who accepts, invalidating all other offers.
- `updateTripMilestone`: Validates sequence (`arrived_pickup` -> `loading` -> `in_transit` -> `completed`).

## 4. Payment Endpoints
- `createPaymentOrder`: Generates a Razorpay order for the booking total in paise.
- `verifyPaymentWebhook`: Validates Razorpay webhook signatures idempotently and transitions booking to `confirmed` / `paid`.
