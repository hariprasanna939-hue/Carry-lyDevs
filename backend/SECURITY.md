# CARRY — Backend Security Architecture & Rules

This document details the security principles, data isolation controls, and access policies enforced across the **CARRY** platform.

---

## 1. Core Security Guarantees

1. **Zero Client-Side Trust**:
   - Clients **never** define trip prices, payment statuses, driver approval statuses, or user roles.
   - All critical calculations (fare breakdown, commission split, driver status) are executed exclusively within server-side Cloud Functions using the Firebase Admin SDK.
2. **Atomic State Transactions**:
   - Concurrent actions (such as two drivers attempting to accept the exact same job offer simultaneously) are isolated via Firestore transactions.
3. **No Public Read/Write Access**:
   - The default catch-all rule is `allow read, write: if false;`. Every query and document access must satisfy an explicit ownership or role condition.
4. **Custom Claims & RBAC**:
   - Privileged operations verify cryptographically signed Firebase Auth Custom Claims (`request.auth.token.roles`), backed by server-side verification against `users/{uid}`.

---

## 2. Firestore Security Rules Matrix

The rules defined in [`backend/firestore.rules`](file:///Users/prasannahari/Projects/carry/backend/firestore.rules) govern access as follows:

| Collection Path | Read Policy | Create Policy | Update Policy | Delete Policy |
|---|---|---|---|---|
| `/users/{uid}` | `isAuthenticated()` | `isOwner(uid)` | `isOwner(uid) \|\| isAdmin()` | `isAdmin()` |
| `/driverApplications/{uid}` | `isOwner(uid) \|\| isAdmin()` | `isOwner(uid)` | `isOwner(uid) \|\| isAdmin()` | `isAdmin()` |
| `/drivers/{uid}` | `isAuthenticated()` | `isOwner(uid) \|\| isAdmin()` | `isOwner(uid) \|\| isAdmin()` | `isAdmin()` |
| `/vehicles/{vehicleId}` | `isAuthenticated()` | `isOwner(driverId) \|\| isAdmin()` | `isOwner(driverId) \|\| isAdmin()` | `isAdmin()` |
| `/bookings/{bookingId}` | Customer, Assigned Driver, Admin | `isOwner(customerId)` | Customer, Assigned Driver, Admin | `isAdmin()` |
| `/driverJobOffers/{offerId}` | Target Driver, Admin | Server / Authenticated | Target Driver, Admin | `isAdmin()` |
| `/trips/{tripId}` | Customer, Driver, Admin | Driver, Admin | Driver, Admin | `isAdmin()` |
| `/payments/{paymentId}` | Customer, Admin | `isAdmin()` (Admin SDK only) | `isAdmin()` | `isAdmin()` |
| `/driverEarnings/{earningId}` | Owner Driver, Admin | `isAdmin()` (Admin SDK only) | `isAdmin()` | `isAdmin()` |
| `/savedAddresses/{addressId}` | `isOwner(userId)` | `isOwner(userId)` | `isOwner(userId)` | `isOwner(userId)` |
| `/notifications/{notifId}` | `isOwner(userId)` | Server / Authenticated | `isOwner(userId)` | `isOwner(userId)` |
| `/reviews/{reviewId}` | `isAuthenticated()` | `isOwner(reviewerId)` | `isAdmin()` | `isAdmin()` |
| `/supportTickets/{ticketId}` | `isOwner(userId) \|\| isAdmin()` | `isOwner(userId)` | `isOwner(userId) \|\| isAdmin()` | `isAdmin()` |
| `/pricingConfig/{configId}` | `isAuthenticated()` | `isAdmin()` | `isAdmin()` | `isAdmin()` |
| `/adminAuditLogs/{logId}` | `isAdmin()` | `isAdmin()` | `false` (Immutable) | `false` |

---

## 3. Storage Security Rules

The storage rules defined in [`backend/storage.rules`](file:///Users/prasannahari/Projects/carry/backend/storage.rules) protect uploaded assets:

1. **Driver KYC & Documents (`/driverDocuments/{uid}/{docType}`)**:
   - Read: Driver owner (`request.auth.uid == uid`) or Admin.
   - Upload: Driver owner (`request.auth.uid == uid`), max file size 10MB, restricted to `image/*` and `application/pdf`.
2. **Vehicle Photos (`/vehiclePhotos/{driverId}/{filename}`)**:
   - Read: Authenticated users.
   - Upload: Vehicle owner (`request.auth.uid == driverId`), max file size 10MB, restricted to images.
3. **Delivery Proofs (`/deliveryProofs/{bookingId}/{filename}`)**:
   - Read: Customer, assigned driver, or admin.
   - Upload: Assigned driver or admin, max file size 10MB.
4. **User Profile Pictures (`/userProfiles/{uid}/{filename}`)**:
   - Read: Authenticated users.
   - Upload: Profile owner (`request.auth.uid == uid`), max 5MB.

---

## 4. Idempotency & Concurrency Controls

1. **Job Offer Acceptance (`acceptBooking`)**:
   - Implemented with `db.runTransaction()`.
   - Checks that `booking.status == 'searching'` and `booking.driverId == null`.
   - If a competing driver accepted a microsecond earlier, the transaction aborts with an `aborted` code and returns a user-friendly error message.
2. **Payment Webhook Processing**:
   - Webhooks verify Razorpay HMAC-SHA256 signatures before processing.
   - Payment capture checks existing payment state. If already `'paid'`, processing is idempotent and skips duplicate ledger credits.
