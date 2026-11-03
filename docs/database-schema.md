# CARRY — Firestore Database Schema

Comprehensive Firestore schema for all 11 collections in the CARRY logistics platform.

---

## 1. `users/{uid}`
- `name`: string (Full user name)
- `phone`: string (Mobile number, e.g. "9876543210")
- `email`: string (User email)
- `roles`: `["customer"]` or `["customer", "driver"]`
- `activePortal`: `"customer"` | `"driver"`
- `photoURL`: string (Profile picture URL)
- `accountStatus`: `"active"` | `"suspended"`
- `createdAt`: timestamp

---

## 2. `driverProfiles/{uid}`
- `userId`: string (References `users/{uid}`)
- `fullName`: string
- `phone`: string
- `verificationStatus`: `"pending"` | `"approved"` | `"rejected"`
- `onlineStatus`: boolean (true if accepting jobs)
- `serviceAreas`: string[] (e.g. `["Gandhipuram", "RS Puram", "Peelamedu", "SIDCO"]`)
- `rating`: number (Average rating out of 5)
- `totalTrips`: number (Total completed loads)
- `createdAt`: timestamp

---

## 3. `vehicles/{vehicleId}`
- `driverId`: string (References `driverProfiles/{uid}`)
- `vehicleType`: string (e.g. `"3_wheeler_cargo"`, `"tata_ace"`, `"pickup_truck"`, `"large_commercial"`)
- `registrationNumber`: string (e.g. `"TN-38-AB-1234"`)
- `capacityKg`: number (e.g. 850)
- `vehiclePhotos`: string[] (Storage download URLs)
- `verificationStatus`: `"pending"` | `"approved"` | `"rejected"`
- `isActive`: boolean

---

## 4. `bookings/{bookingId}`
- `customerId`: string (References `users/{uid}`)
- `driverId`: string (References `driverProfiles/{uid}` when assigned)
- `vehicleId`: string (References `vehicles/{vehicleId}` when assigned)
- `pickup`: map
  - `address`: string
  - `latitude`: number
  - `longitude`: number
  - `contactName`?: string
  - `contactPhone`?: string
- `drop`: map
  - `address`: string
  - `latitude`: number
  - `longitude`: number
  - `contactName`?: string
  - `contactPhone`?: string
- `items`: array of maps
  - `category`: string (e.g. "Furniture", "Electronics")
  - `description`?: string
  - `isFragile`?: boolean
  - `estimatedWeightKg`?: number
- `helperCount`: number (0, 1, or 2)
- `scheduledAt`: timestamp or ISO string (null for instant pickups)
- `distanceKm`: number
- `fareBreakdown`: map
  - `baseFarePaise`: number
  - `distanceFarePaise`: number
  - `helperFarePaise`: number
  - `tollFarePaise`: number
  - `totalFarePaise`: number
- `totalFare`: number (In Rupees)
- `paymentStatus`: `"pending"` | `"paid"` | `"failed"`
- `bookingStatus`: `"searching"` | `"accepted"` | `"arrived_pickup"` | `"in_transit"` | `"completed"` | `"cancelled"`
- `createdAt`: timestamp
- `completedAt`: timestamp (or null)

---

## 5. `bookingEvents/{eventId}`
- `bookingId`: string (References `bookings/{bookingId}`)
- `eventType`: string (e.g. `"created"`, `"searching_driver"`, `"driver_assigned"`, `"arrived_pickup"`, `"in_transit"`, `"completed"`, `"cancelled"`)
- `description`: string
- `createdBy`: string (User UID, Driver UID, or "system")
- `createdAt`: timestamp

---

## 6. `driverLocations/{uid}`
- `latitude`: number
- `longitude`: number
- `bookingId`: string | null (Current active trip if any)
- `updatedAt`: timestamp

---

## 7. `payments/{paymentId}`
- `bookingId`: string (References `bookings/{bookingId}`)
- `customerId`: string (References `users/{uid}`)
- `amount`: number (In Rupees)
- `provider`: `"cash"` | `"upi"` | `"razorpay"` | `"manual"`
- `providerPaymentId`: string
- `paymentStatus`: `"pending"` | `"paid"` | `"failed"`
- `createdAt`: timestamp

---

## 8. `reviews/{reviewId}`
- `bookingId`: string (References `bookings/{bookingId}`)
- `customerId`: string (References `users/{uid}`)
- `driverId`: string (References `driverProfiles/{uid}`)
- `rating`: number (1 to 5)
- `comment`: string

---

## 9. `notifications/{notificationId}`
- `userId`: string (Target user UID)
- `title`: string
- `body`: string
- `read`: boolean
- `createdAt`: timestamp

---

## 10. `pricingRules/{ruleId}`
- `city`: string (e.g. `"Coimbatore"`)
- `vehicleType`: string (e.g. `"tata_ace"`)
- `baseFare`: number
- `perKmRate`: number
- `helperRate`: number
- `isActive`: boolean

---

## 11. `supportTickets/{ticketId}`
- `userId`: string (References `users/{uid}`)
- `bookingId`: string | null (Optional trip reference)
- `issue`: string (Detailed issue description)
- `status`: `"open"` | `"in_progress"` | `"resolved"` | `"closed"`
- `createdAt`: timestamp
