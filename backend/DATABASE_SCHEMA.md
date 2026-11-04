# CARRY — Cloud Firestore Database Schema Documentation

This document defines the production database architecture for the **CARRY** platform (Coimbatore launch). All collections, documents, field specifications, data types, indexes, and relationship constraints are documented below.

---

## 1. High-Level Schema Architecture

```
Firestore Database
│
├── users/{uid}                     # Core user profile & account metadata
├── driverApplications/{uid}        # Onboarding submissions, KYC & verification
├── drivers/{uid}                   # Active driver status, vehicle link & live GPS
├── vehicles/{vehicleId}            # Registered commercial vehicle assets
├── bookings/{bookingId}            # Complete trip orders & pricing breakdowns
├── driverJobOffers/{offerId}       # Individual broadcast dispatch requests
├── trips/{tripId}                  # Live trip progression & telemetry
├── payments/{paymentId}            # Gateway orders, receipts & refunds
├── driverEarnings/{earningId}      # Itemized trip commissions & net payouts
├── savedAddresses/{addressId}      # User-saved favorite pickup/drop locations
├── notifications/{notificationId}  # User-specific in-app & push alerts
├── reviews/{reviewId}              # Customer ratings & reviews for drivers
├── supportTickets/{ticketId}       # Dispute & support issue tracking
├── pricingConfig/{configId}        # Dynamic city rate cards & surcharges
└── adminAuditLogs/{logId}          # Immutable privileged administrative audit trail
```

---

## 2. Detailed Collection & Document Specifications

### 2.1 `users/{uid}`
- **Document ID**: Firebase Auth UID (`request.auth.uid`).
- **Purpose**: Master profile record for every registered user (Customer, Driver, or Admin).

| Field | Type | Required | Description |
|---|---|---|---|
| `role` | `string` | Yes | Primary user role: `'customer'`, `'driver'`, or `'admin'` |
| `roles` | `string[]` | Yes | Array of assigned roles for multi-role accounts |
| `fullName` | `string` | Yes | User's full legal name |
| `email` | `string` | Yes | Verified email address |
| `phone` | `string` | Yes | Primary Indian mobile number (e.g. `+919843012345`) |
| `profileImage` | `string` | No | Public URL to user's profile avatar |
| `accountStatus` | `string` | Yes | `'active'`, `'suspended'`, or `'deleted'` |
| `activePortal` | `string` | Yes | Current active UI view: `'customer'` or `'driver'` |
| `driverVerificationStatus` | `string` | No | `'not_applied'`, `'pending'`, `'approved'`, `'rejected'` |
| `createdAt` | `string / timestamp` | Yes | ISO 8601 string or ServerTimestamp |
| `updatedAt` | `string / timestamp` | Yes | Timestamp of last modification |

---

### 2.2 `driverApplications/{uid}`
- **Document ID**: Driver's Firebase Auth UID.
- **Purpose**: Stores multi-step onboarding forms, draft progress, KYC documents, and admin verification status.

| Field | Type | Required | Description |
|---|---|---|---|
| `personalDetails` | `map` | Yes | `{ fullName, phone, email, city, address }` |
| `identityDetails` | `map` | Yes | `{ aadhaarNumber, panNumber, aadhaarFrontUrl, aadhaarBackUrl, panCardUrl }` |
| `drivingDetails` | `map` | Yes | `{ licenseNumber, licenseExpiry, licenseFrontUrl, licenseBackUrl }` |
| `vehicleDetails` | `map` | Yes | `{ vehicleType, vehicleSize, registrationNumber, capacityKg, rcDocUrl, insuranceDocUrl }` |
| `documentReferences` | `map` | Yes | Key-value mapping of uploaded storage URLs |
| `onboardingCompleted` | `boolean` | Yes | `true` if all mandatory steps are submitted |
| `approvalStatus` | `string` | Yes | `'unsubmitted'`, `'pending'`, `'approved'`, `'rejected'`, `'suspended'` |
| `rejectionReason` | `string` | No | Admin-specified rationale if rejected |
| `submittedAt` | `string` | Yes | ISO timestamp when application was submitted |
| `reviewedAt` | `string` | No | ISO timestamp when reviewed by admin |
| `reviewedBy` | `string` | No | UID of approving/rejecting admin |

---

### 2.3 `drivers/{uid}`
- **Document ID**: Driver's Firebase Auth UID.
- **Purpose**: Live availability, active vehicle association, GPS telemetry, and driver aggregate metrics.

| Field | Type | Required | Description |
|---|---|---|---|
| `isAvailable` | `boolean` | Yes | `true` if driver is online and accepting jobs |
| `activeVehicleId` | `string` | No | ID of currently selected vehicle asset |
| `currentLocation` | `map` | No | `{ latitude, longitude, heading, speed, updatedAt }` |
| `rating` | `number` | Yes | Aggregate rating (1.0 to 5.0, default: 5.0) |
| `completedTrips` | `number` | Yes | Total count of successfully completed deliveries |
| `totalEarningsPaise` | `number` | No | Cumulative lifetime net earnings in paise |
| `updatedAt` | `string` | Yes | ISO timestamp of last heartbeat or status change |

---

### 2.4 `vehicles/{vehicleId}`
- **Document ID**: Auto-generated string (e.g. `veh_...`).
- **Purpose**: Vehicle assets owned and operated by drivers.

| Field | Type | Required | Description |
|---|---|---|---|
| `driverId` | `string` | Yes | References `users/{uid}` |
| `vehicleType` | `string` | Yes | Commercial type: `'two_wheeler'`, `'three_wheeler'`, `'tata_ace'`, `'pickup_8ft'` |
| `vehicleSize` | `string` | Yes | Matching size categorization |
| `registrationNumber` | `string` | Yes | Official RTO registration number (e.g. `TN38AB1234`) |
| `verificationStatus` | `string` | Yes | `'pending'`, `'approved'`, `'rejected'` |
| `capacityKg` | `number` | Yes | Maximum cargo payload capacity in kg |
| `vehiclePhotos` | `string[]` | No | Exterior and interior photo URLs |
| `isActive` | `boolean` | Yes | Soft-delete / active toggle |

---

### 2.5 `bookings/{bookingId}`
- **Document ID**: Auto-generated string (e.g. `bk_...`).
- **Purpose**: Customer orders for goods transportation.

| Field | Type | Required | Description |
|---|---|---|---|
| `customerId` | `string` | Yes | References `users/{uid}` |
| `driverId` | `string` | No | Assigned driver UID (set atomically upon acceptance) |
| `pickup` | `map` | Yes | `{ address, landmark, latitude, longitude, contactName, contactPhone }` |
| `drop` | `map` | Yes | `{ address, landmark, latitude, longitude, contactName, contactPhone }` |
| `vehicleSize` | `string` | Yes | Required vehicle category |
| `bookingType` | `string` | Yes | `'immediate'` or `'scheduled'` |
| `helperCount` | `number` | Yes | Number of requested loading/unloading helpers (0–5) |
| `scheduledAt` | `string` | Yes | ISO timestamp for required pickup |
| `fare` | `map` | Yes | `{ baseFare, distanceFare, timeFare, helperFee, tax, discount, total }` |
| `bookingStatus` | `string` | Yes | Current state in booking lifecycle |
| `paymentStatus` | `string` | Yes | `'pending'`, `'paid'`, `'failed'`, `'refunded'` |
| `pickupOtp` | `string` | Yes | 4-digit OTP verified upon cargo loading |
| `dropOtp` | `string` | Yes | 4-digit OTP verified upon delivery completion |
| `rejectionHistory` | `string[]` | No | UIDs of drivers who rejected this job request |
| `createdAt` | `string` | Yes | Booking creation timestamp |

---

### 2.6 `driverJobOffers/{offerId}`
- **Document ID**: Auto-generated string (e.g. `disp_...`).
- **Purpose**: Targeted job offers dispatched to nearby drivers.

| Field | Type | Required | Description |
|---|---|---|---|
| `bookingId` | `string` | Yes | References `bookings/{bookingId}` |
| `driverId` | `string` | Yes | References `drivers/{uid}` |
| `status` | `string` | Yes | `'pending'`, `'accepted'`, `'rejected'`, `'expired'` |
| `expiresAt` | `string` | Yes | Expiration timestamp (typically +30 seconds) |
| `createdAt` | `string` | Yes | Dispatch timestamp |

---

### 2.7 `trips/{tripId}`
- **Document ID**: Typically matches `bookingId` for 1:1 mapping.
- **Purpose**: Live trip progression telemetry and delivery proofs.

| Field | Type | Required | Description |
|---|---|---|---|
| `bookingId` | `string` | Yes | References `bookings/{bookingId}` |
| `customerId` | `string` | Yes | References customer `users/{uid}` |
| `driverId` | `string` | Yes | References driver `users/{uid}` |
| `tripStatus` | `string` | Yes | `'accepted'`, `'arrived_pickup'`, `'in_transit'`, `'arrived_drop'`, `'completed'`, `'cancelled'` |
| `startedAt` | `string` | No | Timestamp when trip went into transit |
| `completedAt` | `string` | No | Timestamp when delivery OTP was verified |
| `deliveryProofUrl`| `string` | No | Photo URL of signed POD or delivered goods |
| `createdAt` | `string` | Yes | Creation timestamp |

---

### 2.8 `payments/{paymentId}`
- **Document ID**: Auto-generated string (e.g. `pay_...`).
- **Purpose**: Payment orders, gateway references, and status tracking.

| Field | Type | Required | Description |
|---|---|---|---|
| `bookingId` | `string` | Yes | References `bookings/{bookingId}` |
| `customerId` | `string` | Yes | References customer `users/{uid}` |
| `amount` | `number` | Yes | Total payment amount in INR |
| `currency` | `string` | Yes | Currency code (`'INR'`) |
| `gatewayReference`| `string` | Yes | Razorpay orderId (`order_...`) or paymentId |
| `status` | `string` | Yes | `'pending'`, `'paid'`, `'failed'`, `'refunded'` |
| `refundReason` | `string` | No | Explanation if refunded |
| `createdAt` | `string` | Yes | Creation timestamp |

---

### 2.9 `driverEarnings/{earningId}`
- **Document ID**: Auto-generated string (e.g. `earn_...`).
- **Purpose**: Ledger of driver commissions and net payouts per completed booking.

| Field | Type | Required | Description |
|---|---|---|---|
| `driverId` | `string` | Yes | References `drivers/{uid}` |
| `bookingId` | `string` | Yes | References `bookings/{bookingId}` |
| `grossAmount` | `number` | Yes | Full booking total fare |
| `commission` | `number` | Yes | Platform commission (15%) |
| `netAmount` | `number` | Yes | Net earnings credited to driver (85%) |
| `status` | `string` | Yes | `'credited'`, `'pending'`, `'withdrawn'` |
| `createdAt` | `string` | Yes | Timestamp of trip completion |

---

### 2.10 `savedAddresses/{addressId}`
- **Document ID**: Auto-generated string (`addr_...`).
- **Purpose**: Customer favorite locations (Home, Office, Factory, Shop).

| Field | Type | Required | Description |
|---|---|---|---|
| `userId` | `string` | Yes | References `users/{uid}` |
| `label` | `string` | Yes | User label (e.g. "Main Warehouse") |
| `address` | `string` | Yes | Full human-readable street address |
| `landmark` | `string` | No | Nearby landmark |
| `latitude` | `number` | Yes | GPS latitude (-90 to 90) |
| `longitude` | `number` | Yes | GPS longitude (-180 to 180) |
| `contactName` | `string` | No | Contact person at site |
| `contactPhone` | `string` | No | Contact phone number |

---

### 2.11 `notifications/{notificationId}`
- **Document ID**: Auto-generated string (`notif_...`).
- **Purpose**: History of in-app and push notification alerts.

| Field | Type | Required | Description |
|---|---|---|---|
| `userId` | `string` | Yes | Recipient user UID |
| `title` | `string` | Yes | Push notification title |
| `body` | `string` | Yes | Push notification body |
| `data` | `map` | No | Deep-link metadata (`bookingId`, `type`, etc.) |
| `read` | `boolean` | Yes | Whether read by user |
| `createdAt` | `string` | Yes | Dispatch timestamp |

---

### 2.12 `reviews/{reviewId}`
- **Document ID**: Auto-generated string (`rev_...`).
- **Purpose**: 1-to-5 star ratings and reviews between customers and drivers.

| Field | Type | Required | Description |
|---|---|---|---|
| `bookingId` | `string` | Yes | References `bookings/{bookingId}` |
| `reviewerId` | `string` | Yes | UID of author |
| `targetUserId` | `string` | Yes | UID of rated driver or customer |
| `rating` | `number` | Yes | Rating integer (1 to 5) |
| `comment` | `string` | No | Optional review text |
| `createdAt` | `string` | Yes | Submission timestamp |

---

### 2.13 `supportTickets/{ticketId}`
- **Document ID**: Auto-generated string (`ticket_...`).
- **Purpose**: Customer disputes, issues, and assistance tickets.

| Field | Type | Required | Description |
|---|---|---|---|
| `userId` | `string` | Yes | Author UID |
| `bookingId` | `string` | No | Related booking ID |
| `category` | `string` | Yes | `'trip_issue'`, `'payment_issue'`, `'driver_issue'`, `'app_bug'`, `'other'` |
| `subject` | `string` | Yes | Brief subject |
| `description` | `string` | Yes | Detailed explanation |
| `evidenceUrls` | `string[]` | No | Attached photo/screenshot URLs |
| `status` | `string` | Yes | `'open'`, `'in_progress'`, `'resolved'`, `'closed'` |
| `resolutionNote`| `string` | No | Administrative resolution comment |

---

### 2.14 `pricingConfig/{configId}`
- **Document ID**: Lowercase city identifier (e.g. `coimbatore`).
- **Purpose**: Live server-side pricing parameters.

| Field | Type | Required | Description |
|---|---|---|---|
| `city` | `string` | Yes | City name ("Coimbatore") |
| `vehicleRates` | `map` | Yes | Base fare, base km, per-km rate, per-minute rate by vehicle |
| `helperRatePerPerson` | `number` | Yes | Default ₹150 per person |
| `nightSurcharge` | `number` | Yes | Default ₹50 flat |
| `gstRate` | `number` | Yes | Default 0.05 (5%) |
| `updatedAt` | `string` | Yes | Last modified timestamp |

---

### 2.15 `adminAuditLogs/{logId}`
- **Document ID**: Auto-generated string (`audit_...`).
- **Purpose**: Immutable security audit record of administrative actions.

| Field | Type | Required | Description |
|---|---|---|---|
| `adminId` | `string` | Yes | Admin UID who performed the action |
| `action` | `string` | Yes | Action code (`APPROVE_DRIVER`, `UPDATE_PRICING`, etc.) |
| `targetType` | `string` | Yes | Target resource (`driver`, `booking`, `pricing`) |
| `targetId` | `string` | Yes | Target document ID |
| `details` | `map` | No | Arbitrary context payload |
| `timestamp` | `string` | Yes | Execution timestamp |

---

## 3. Required Firestore Indexes

The composite indexes defined in [`firestore.indexes.json`](file:///Users/prasannahari/Projects/carry/backend/firestore.indexes.json) support the core queries:

1. **`bookings`**: `customerId` ASC + `createdAt` DESC (Customer trip history).
2. **`bookings`**: `driverId` ASC + `createdAt` DESC (Driver trip history).
3. **`bookings`**: `status` ASC + `scheduledAt` ASC (Scheduled booking queue).
4. **`driverJobOffers`**: `driverId` ASC + `status` ASC (Driver active offers).
5. **`driverEarnings`**: `driverId` ASC + `createdAt` DESC (Driver earnings ledger).
6. **`drivers`**: `verificationStatus` ASC + `isAvailable` ASC (Active nearby driver queries).
7. **`payments`**: `customerId` ASC + `createdAt` DESC (Customer payment history).
8. **`reviews`**: `targetUserId` ASC + `createdAt` DESC (Driver rating aggregation).
