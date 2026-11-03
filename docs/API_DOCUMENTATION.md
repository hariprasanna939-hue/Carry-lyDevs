# CARRY — Cloud Functions Backend API Specification

All sensitive backend operations are handled by secure, callable Cloud Functions in `functions/src/index.ts` deployed to the `asia-south1` (Mumbai) region for minimum latency in India.

---

## 1. Cloud Functions Summary

| Function | Access Control | Purpose |
| :--- | :--- | :--- |
| **`createBooking`** | Authenticated User | Validates pickup/drop, recalculates fare authoritatively on server, generates OTPs, creates booking in `searching` state, and logs event in `bookingEvents`. |
| **`calculateFare`** | Public / Authenticated | Calculates base, distance, and helper fees from server-side `pricingRules` in Firestore. |
| **`findNearbyDrivers`** | Authenticated User | Finds verified (`verificationStatus == "approved"`), online drivers within radius without active jobs. |
| **`sendDriverRequest`** | Authenticated User | Dispatches in-app notification and job alert to target driver and records in `bookingEvents`. |
| **`acceptBooking`** | Authenticated Driver | **Critical**: Uses atomic Firestore transaction to prevent race conditions when multiple drivers accept simultaneously. |
| **`rejectBooking`** | Authenticated Driver | Adds driver to `rejectedDriverIds` array on booking and triggers candidate search. |
| **`updateTripStatus`** | Assigned Driver | Enforces valid milestone progression (`accepted` -> `arrived_pickup` -> `in_transit` -> `completed`) and verifies `pickupOtp`. |
| **`updateDriverLocation`** | Authenticated Driver | Persists authorized driver GPS coordinates and heading in `driverLocations/{uid}`. |
| **`completeBooking`** | Assigned Driver | Validates `deliveryOtp` / proof photo, frees driver, increments `totalTrips` in driver profile, and marks booking `completed`. |
| **`createPaymentOrder`** | Authenticated User | Initializes payment order in `payments/{paymentId}` with status `pending`. |
| **`verifyPayment`** | Authenticated User | Cryptographically verifies payment signature (HMAC SHA-256) and updates booking and payment records to `paid`. |
| **`submitDriverApplication`**| Authenticated User | Registers driver KYC, vehicle specs, and documents in `driverProfiles`, `vehicles`, and `users`. |
| **`approveDriver`** | Admin Only | Validates admin role, updates driver profile to `approved`, and provisions `"driver"` role in user claims. |
| **`sendBookingNotification`**| Authenticated User | Stores notification in `notifications` collection and dispatches FCM push notification. |

---

## 2. Critical Implementation Detail: `acceptBooking` Transaction

```typescript
export async function acceptBookingInternal(bookingId: string, driverId: string) {
  const bookingRef = db.collection("bookings").doc(bookingId);
  const driverProfileRef = db.collection("driverProfiles").doc(driverId);
  const driverLocationRef = db.collection("driverLocations").doc(driverId);

  return await db.runTransaction(async (transaction) => {
    // 1. Read booking within transaction
    const bookingDoc = await transaction.get(bookingRef);
    if (!bookingDoc.exists) throw new Error("Booking not found");

    const bookingData = bookingDoc.data();
    // 2. Reject if another driver already claimed it
    if (bookingData.bookingStatus !== "searching" || bookingData.driverId) {
      throw new Error("This booking has already been accepted by another driver.");
    }

    // 3. Verify driver status
    const driverDoc = await transaction.get(driverProfileRef);
    if (driverDoc.data()?.verificationStatus !== "approved") {
      throw new Error("Driver is not approved.");
    }

    // 4. Atomically assign driver
    transaction.update(bookingRef, {
      driverId,
      bookingStatus: "accepted",
      status: "accepted",
      acceptedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // 5. Link driver location & log audit event
    transaction.set(driverLocationRef, { driverId, bookingId }, { merge: true });
    // ...
  });
}
```

---

## 3. Client SDK Usage in Mobile App

The mobile application invokes these functions directly via `cloudFunctionsService` in [`src/services/functions.ts`](file:///Users/prasannahari/Projects/carry/src/services/functions.ts):

```typescript
import { cloudFunctionsService } from "../services/functions";

// Accept job with atomic transaction
const result = await cloudFunctionsService.acceptBooking({ bookingId: "CARRY-12345" });
```
