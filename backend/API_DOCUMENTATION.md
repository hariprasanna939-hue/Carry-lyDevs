# CARRY — API & Cloud Functions Documentation

Complete reference for all 30 production callable Cloud Functions exposed by the **CARRY** backend.

All callable functions require Firebase Authentication unless explicitly noted. Responses follow the standard `ApiResponse<T>` envelope:
```json
{
  "success": true,
  "data": { ... },
  "message": "Optional message",
  "timestamp": "2026-11-04T10:00:00.000Z"
}
```

---

## 1. Authentication & User Profile APIs

### `createUserProfile`
- **Purpose**: Creates or updates user record upon initial registration.
- **Auth**: Authenticated (`request.auth.uid`).
- **Input**:
  ```json
  {
    "name": "Ravi Kumar",
    "phone": "+919843012345",
    "email": "ravi@example.com",
    "role": "customer"
  }
  ```
- **Output**: Complete `UserProfile` document.
- **DB Operations**: Writes to `users/{uid}`, sets Firebase Auth custom user claims (`roles: ['customer']`).

### `getMyProfile`
- **Purpose**: Retrieves profile of currently authenticated user.
- **Auth**: Authenticated.
- **Input**: None.
- **Output**: `UserProfile` document.

### `updateMyProfile`
- **Purpose**: Updates permitted user fields (name, phone, photoURL).
- **Auth**: Authenticated.
- **Input**:
  ```json
  {
    "name": "Ravi K",
    "phone": "+919843099999"
  }
  ```
- **Output**: Updated `UserProfile`.

---

## 2. Driver Onboarding & Verification APIs

### `saveDriverOnboardingDraft`
- **Purpose**: Saves incomplete onboarding application steps so drivers can resume anytime.
- **Auth**: Authenticated driver.
- **Input**: Any partial onboarding step payload (personal details, vehicle details, documents).
- **Output**: `{ "driverId": "...", "saved": true }`.
- **DB Operations**: Merges into `driverApplications/{uid}` with `approvalStatus: "unsubmitted"`.

### `getDriverApplication`
- **Purpose**: Retrieves driver's own onboarding application and uploaded documents.
- **Auth**: Authenticated driver.
- **Input**: None.
- **Output**: Full `DriverApplicationDocument`.

### `submitDriverApplication`
- **Purpose**: Submits completed driver application for administrative review.
- **Auth**: Authenticated driver.
- **Input**:
  ```json
  {
    "fullName": "Suresh Raina",
    "phone": "+919876543210",
    "vehicleType": "tata_ace",
    "vehicleRegistrationNumber": "TN38AB1234",
    "documents": [
      { "type": "driving_license", "frontUrl": "https://..." },
      { "type": "aadhaar", "frontUrl": "https://..." }
    ]
  }
  ```
- **Output**: Updated application profile with `approvalStatus: "pending"`.
- **DB Operations**: Updates `driverApplications/{uid}`, registers vehicle in `vehicles/{vehId}`, initializes `drivers/{uid}`.

### `getDriverVerificationStatus`
- **Purpose**: Checks real-time approval status (`unsubmitted`, `pending`, `approved`, `rejected`).
- **Auth**: Authenticated driver.
- **Input**: None.
- **Output**: `{ "verificationStatus": "pending", "rejectionReason": null }`.

### `updateDriverAvailability`
- **Purpose**: Toggles driver online / offline state and updates GPS location.
- **Auth**: Authenticated verified driver.
- **Input**:
  ```json
  {
    "onlineStatus": true,
    "latitude": 11.0168,
    "longitude": 76.9558
  }
  ```
- **Output**: `{ "onlineStatus": true, "currentLocation": { ... } }`.
- **Error Condition**: Throws `failed-precondition` if driver is not yet approved.

---

## 3. Pricing & Booking APIs

### `calculateFare`
- **Purpose**: Authoritative server-side fare calculation for a prospective trip.
- **Auth**: Authenticated.
- **Input**:
  ```json
  {
    "vehicleType": "tata_ace",
    "pickup": { "latitude": 11.0168, "longitude": 76.9558 },
    "drop": { "latitude": 11.0088, "longitude": 76.9458 },
    "helperCount": 1
  }
  ```
- **Output**:
  ```json
  {
    "distanceKm": 1.41,
    "durationMinutes": 10,
    "breakdown": {
      "baseFare": 220,
      "distanceFare": 0,
      "timeFare": 20,
      "helperFee": 150,
      "tax": 20,
      "discount": 0,
      "total": 410
    },
    "totalFare": 410
  }
  ```

### `createBooking`
- **Purpose**: Creates an immediate or scheduled delivery order with server-verified pricing.
- **Auth**: Authenticated customer.
- **Input**:
  ```json
  {
    "vehicleType": "tata_ace",
    "pickup": { "address": "Gandhipuram", "latitude": 11.0168, "longitude": 76.9558, "contactName": "A", "contactPhone": "9843012345" },
    "drop": { "address": "RS Puram", "latitude": 11.0088, "longitude": 76.9458, "contactName": "B", "contactPhone": "9843098765" },
    "items": [{ "name": "Furniture", "quantity": 2 }],
    "helperCount": 1,
    "scheduledAt": "2026-11-04T18:00:00.000Z"
  }
  ```
- **Output**: Created `BookingDocument` with 4-digit pickup and drop OTPs.
- **DB Operations**: Writes `bookings/{bookingId}`, triggers driver matching.

### `getBookingDetails`
- **Purpose**: Retrieves authorized trip details.
- **Auth**: Customer, assigned driver, or admin.
- **Input**: `{ "bookingId": "bk_..." }`.
- **Output**: `BookingDocument`.

### `cancelBooking`
- **Purpose**: Cancels booking under CARRY cancellation policy.
- **Auth**: Customer (before in-transit), assigned driver, or admin.
- **Input**: `{ "bookingId": "bk_...", "reason": "Change of plans" }`.
- **Output**: Updated booking in `cancelled` state.

### `getMyBookings`
- **Purpose**: Lists trip history for customer or driver.
- **Auth**: Authenticated.
- **Input**: None.
- **Output**: Array of `BookingDocument`.

---

## 4. Dispatch, Matching & Live Trip APIs

### `findAvailableDrivers`
- **Purpose**: Finds active, nearby, verified drivers within radius.
- **Auth**: Authenticated.
- **Input**: `{ "latitude": 11.0168, "longitude": 76.9558, "radiusKm": 7 }`.
- **Output**: Array of driver profiles with Haversine distance in km.

### `sendDriverJobOffers`
- **Purpose**: Dispatches targeted delivery request to one or more drivers.
- **Auth**: Server / Dispatch engine.
- **Input**: `{ "bookingId": "bk_...", "driverIds": ["drv_1"] }`.
- **Output**: `{ "offersSent": 1 }`.
- **DB Operations**: Writes `driverJobOffers/{offerId}`, sends FCM push alert.

### `respondToJobOffer`
- **Purpose**: Driver accepts or rejects a job offer.
- **Auth**: Authenticated target driver.
- **Input**: `{ "offerId": "disp_...", "action": "accept" }`.
- **Output**: `{ "action": "accepted", "result": { ... } }`.
- **Concurrency Guarantee**: Uses **Firestore Transaction** to prevent duplicate acceptance.

### `startTrip`
- **Purpose**: Marks trip in transit.
- **Auth**: Assigned driver.
- **Input**: `{ "bookingId": "bk_..." }`.
- **Output**: Trip status updated to `in_transit`.

### `updateTripLocation`
- **Purpose**: Live GPS telemetry streaming during active delivery.
- **Auth**: Assigned driver.
- **Input**: `{ "latitude": 11.0150, "longitude": 76.9520, "heading": 180, "speed": 28 }`.
- **Output**: `{ "recorded": true }`.

### `completeTrip`
- **Purpose**: Completes delivery after customer provides drop OTP.
- **Auth**: Assigned driver.
- **Input**: `{ "bookingId": "bk_...", "otp": "4821", "deliveryProofUrl": "https://..." }`.
- **Output**: Trip status updated to `completed`; triggers automatic driver earnings ledger credit.

---

## 5. Payments & Earnings APIs

### `createPaymentOrder`
- **Purpose**: Generates trusted Razorpay order.
- **Auth**: Authenticated customer.
- **Input**: `{ "bookingId": "bk_..." }`.
- **Output**: `{ "id": "order_...", "amount": 41000, "currency": "INR" }`.

### `verifyPayment`
- **Purpose**: Validates HMAC-SHA256 signature returned by payment gateway.
- **Auth**: Authenticated customer.
- **Input**: `{ "bookingId": "...", "orderId": "...", "paymentId": "...", "signature": "..." }`.
- **Output**: `{ "verified": true }`.

### `processPaymentWebhook`
- **Purpose**: Handles asynchronous server-to-server webhook events from Razorpay.
- **Auth**: Public endpoint protected by `x-razorpay-signature` verification.
- **Protocol**: HTTP POST (`onRequest`).

### `createRefund`
- **Purpose**: Processes authorized refund for cancelled or disputed booking.
- **Auth**: Admin or authorized system actor.
- **Input**: `{ "paymentId": "pay_...", "reason": "Customer cancellation" }`.
- **Output**: `{ "status": "refunded" }`.

### `getDriverEarnings`
- **Purpose**: Fetches lifetime & weekly earnings ledger for authenticated driver.
- **Auth**: Authenticated driver.
- **Input**: None.
- **Output**: Itemized net payout summary and commission breakdown.

---

## 6. Notifications, Reviews & Support APIs

### `registerPushToken`
- **Purpose**: Registers FCM device push notification token.
- **Auth**: Authenticated user.
- **Input**: `{ "token": "fcm_token_..." }`.
- **Output**: `{ "success": true }`.

### `submitReview`
- **Purpose**: Submits star rating and feedback for completed trip.
- **Auth**: Authenticated reviewer.
- **Input**: `{ "bookingId": "bk_...", "rating": 5, "comment": "Fast and safe driving!" }`.
- **Output**: Created review record; recomputes driver aggregate rating.

### `createSupportTicket`
- **Purpose**: Submits dispute or customer service issue.
- **Auth**: Authenticated user.
- **Input**:
  ```json
  {
    "bookingId": "bk_...",
    "category": "trip_issue",
    "subject": "Delay during loading",
    "description": "Driver arrived 20 minutes late."
  }
  ```
- **Output**: Support ticket document in `open` status.

---

## 7. Administrative APIs

### `approveDriver`
- **Purpose**: Admin approves driver KYC and enables online access.
- **Auth**: Admin only (`request.auth.token.roles contains 'admin'`).
- **Input**: `{ "driverId": "uid_..." }`.
- **Output**: Sets driver status to `approved`, grants custom driver claims.

### `rejectDriver`
- **Purpose**: Admin rejects driver onboarding application with reason.
- **Auth**: Admin only.
- **Input**: `{ "driverId": "uid_...", "reason": "Driving license expired" }`.
- **Output**: Sets driver status to `rejected`.

### `updatePricingConfig`
- **Purpose**: Updates live city base rates, per-km fees, and helper charges.
- **Auth**: Admin only.
- **Input**: `{ "city": "coimbatore", "pricing": { ... } }`.
- **Output**: `{ "success": true }`.
