# CARRY Backend Architecture & Cloud Functions

Production-ready backend services, serverless Cloud Functions, and Firebase rules for the **CARRY** Logistics & Goods Transportation Platform (Coimbatore launch).

---

## Complete Documentation Suite

- 📖 **[API Documentation](file:///Users/prasannahari/Projects/carry/backend/API_DOCUMENTATION.md)**: Exhaustive reference for all 30 callable Cloud Functions, input/output schemas, error conditions, and authorizations.
- 🗄️ **[Database Schema](file:///Users/prasannahari/Projects/carry/backend/DATABASE_SCHEMA.md)**: Full field specifications, data types, indexes, and relationship constraints across all 15 Firestore collections.
- 🛡️ **[Security Architecture](file:///Users/prasannahari/Projects/carry/backend/SECURITY.md)**: Firestore and Storage security rules, RBAC, anti-tampering policies, and atomic transaction guarantees.
- 🚀 **[Deployment Guide](file:///Users/prasannahari/Projects/carry/backend/DEPLOYMENT.md)**: Instructions for running the Firebase Emulator Suite locally and deploying to production (`carry-bd2d7`).

---

## 30 Major Callable API Functions

| # | Function Name | Purpose | Implementation File |
|---|---|---|---|
| 1 | `createUserProfile` | Create profile after registration | [`auth.controller.ts`](file:///Users/prasannahari/Projects/carry/backend/functions/src/modules/auth/auth.controller.ts#L13) |
| 2 | `getMyProfile` | Get authenticated profile | [`user.controller.ts`](file:///Users/prasannahari/Projects/carry/backend/functions/src/modules/users/user.controller.ts#L12) |
| 3 | `updateMyProfile` | Update permitted profile fields | [`user.controller.ts`](file:///Users/prasannahari/Projects/carry/backend/functions/src/modules/users/user.controller.ts#L27) |
| 4 | `submitDriverApplication` | Submit driver application | [`driver.controller.ts`](file:///Users/prasannahari/Projects/carry/backend/functions/src/modules/drivers/driver.controller.ts#L13) |
| 5 | `saveDriverOnboardingDraft` | Save incomplete onboarding | [`driver.controller.ts`](file:///Users/prasannahari/Projects/carry/backend/functions/src/modules/drivers/driver.controller.ts#L27) |
| 6 | `getDriverApplication` | Get own onboarding information | [`driver.controller.ts`](file:///Users/prasannahari/Projects/carry/backend/functions/src/modules/drivers/driver.controller.ts#L43) |
| 7 | `getDriverVerificationStatus` | Check pending/approved/rejected | [`driver.controller.ts`](file:///Users/prasannahari/Projects/carry/backend/functions/src/modules/drivers/driver.controller.ts#L56) |
| 8 | `updateDriverAvailability` | Update online/offline status | [`driver.controller.ts`](file:///Users/prasannahari/Projects/carry/backend/functions/src/modules/drivers/driver.controller.ts#L71) |
| 9 | `createBooking` | Create booking | [`booking.controller.ts`](file:///Users/prasannahari/Projects/carry/backend/functions/src/modules/bookings/booking.controller.ts#L13) |
| 10 | `calculateFare` | Calculate booking price | [`pricing.controller.ts`](file:///Users/prasannahari/Projects/carry/backend/functions/src/modules/pricing/pricing.controller.ts#L10) |
| 11 | `getBookingDetails` | Get authorized booking details | [`booking.controller.ts`](file:///Users/prasannahari/Projects/carry/backend/functions/src/modules/bookings/booking.controller.ts#L27) |
| 12 | `cancelBooking` | Cancel booking under policy | [`booking.controller.ts`](file:///Users/prasannahari/Projects/carry/backend/functions/src/modules/bookings/booking.controller.ts#L43) |
| 13 | `getMyBookings` | Get customer booking history | [`booking.controller.ts`](file:///Users/prasannahari/Projects/carry/backend/functions/src/modules/bookings/booking.controller.ts#L57) |
| 14 | `findAvailableDrivers` | Find compatible nearby drivers | [`dispatch.controller.ts`](file:///Users/prasannahari/Projects/carry/backend/functions/src/modules/dispatch/dispatch.controller.ts#L11) |
| 15 | `sendDriverJobOffers` | Send job offers | [`dispatch.controller.ts`](file:///Users/prasannahari/Projects/carry/backend/functions/src/modules/dispatch/dispatch.controller.ts#L28) |
| 16 | `respondToJobOffer` | Accept/reject an offer | [`dispatch.controller.ts`](file:///Users/prasannahari/Projects/carry/backend/functions/src/modules/dispatch/dispatch.controller.ts#L57) |
| 17 | `startTrip` | Start assigned trip | [`trip.controller.ts`](file:///Users/prasannahari/Projects/carry/backend/functions/src/modules/trips/trip.controller.ts#L23) |
| 18 | `updateTripLocation` | Update driver's location | [`trip.controller.ts`](file:///Users/prasannahari/Projects/carry/backend/functions/src/modules/trips/trip.controller.ts#L52) |
| 19 | `completeTrip` | Complete trip | [`trip.controller.ts`](file:///Users/prasannahari/Projects/carry/backend/functions/src/modules/trips/trip.controller.ts#L69) |
| 20 | `createPaymentOrder` | Initiate payment | [`payment.controller.ts`](file:///Users/prasannahari/Projects/carry/backend/functions/src/modules/payments/payment.controller.ts#L10) |
| 21 | `verifyPayment` | Verify payment with gateway | [`payment.controller.ts`](file:///Users/prasannahari/Projects/carry/backend/functions/src/modules/payments/payment.controller.ts#L25) |
| 22 | `processPaymentWebhook` | Process trusted payment events | [`payment.controller.ts`](file:///Users/prasannahari/Projects/carry/backend/functions/src/modules/payments/payment.controller.ts#L41) |
| 23 | `createRefund` | Process authorized refund | [`payment.controller.ts`](file:///Users/prasannahari/Projects/carry/backend/functions/src/modules/payments/payment.controller.ts#L56) |
| 24 | `getDriverEarnings` | Get driver's earnings | [`payment.controller.ts`](file:///Users/prasannahari/Projects/carry/backend/functions/src/modules/payments/payment.controller.ts#L73) |
| 25 | `registerPushToken` | Register device notification token | [`notification.controller.ts`](file:///Users/prasannahari/Projects/carry/backend/functions/src/modules/notifications/notification.controller.ts#L10) |
| 26 | `submitReview` | Submit customer rating | [`review.controller.ts`](file:///Users/prasannahari/Projects/carry/backend/functions/src/modules/reviews/review.controller.ts#L9) |
| 27 | `createSupportTicket` | Create support request | [`support.controller.ts`](file:///Users/prasannahari/Projects/carry/backend/functions/src/modules/support/support.controller.ts#L9) |
| 28 | `approveDriver` | Admin-only approval | [`admin.controller.ts`](file:///Users/prasannahari/Projects/carry/backend/functions/src/modules/admin/admin.controller.ts#L7) |
| 29 | `rejectDriver` | Admin-only rejection | [`admin.controller.ts`](file:///Users/prasannahari/Projects/carry/backend/functions/src/modules/admin/admin.controller.ts#L19) |
| 30 | `updatePricingConfig` | Admin-only fare configuration | [`admin.controller.ts`](file:///Users/prasannahari/Projects/carry/backend/functions/src/modules/admin/admin.controller.ts#L94) |

---

## Event-Driven Firestore Triggers & Scheduled Jobs

- `onUserCreated`: Auto-creates default customer profile upon Firebase Auth creation.
- `onDriverStatusUpdated`: Syncs approval status to custom claims and activates driver portal permissions.
- `onBookingCreated`: Dispatches initial searching state.
- `onDispatchRequestUpdated`: Retries dispatch on driver rejection or expiration.
- `onTripStatusChanged`: Emits push notifications on trip progression.
- `checkScheduledBookings`: PubSub job running every 5 min to trigger scheduled trips.
- `sendDriverTripReminders`: PubSub job running every 10 min for upcoming trips.
- `cancelStaleSearchingBookings`: PubSub job cancelling unfilled requests older than 15 min.
- `cleanupExpiredDispatchRequests`: Daily maintenance job purging expired offers.
