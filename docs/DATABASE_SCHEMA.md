# CARRY — Database Schema (Cloud Firestore)

## 1. Core Collections Overview

| Collection | Document ID | Purpose | Write Access |
| :--- | :--- | :--- | :--- |
| `users` | `{uid}` | User profiles, account status, roles | User (restricted) / Admin |
| `driverProfiles` | `{uid}` | Driver details, verification status, city | User (create pending) / Admin (approve/reject) |
| `driverVehicles` | `{vehicleId}` | Commercial vehicles registered to drivers | Driver (create) / Admin (verify) |
| `vehicleCategories` | `{categoryId}` | Platform-supported vehicles & specs | Admin only |
| `bookings` | `{bookingId}` | Bookings lifecycle, locations, fares | Backend / Customer / Driver (status updates) |
| `bookingOffers` | `{offerId}` | Ephemeral dispatch offers sent to drivers | Backend dispatch engine |
| `driverLocations` | `{driverId}` | Live GPS location of active drivers | Assigned Driver |
| `payments` | `{paymentId}` | Payment records & transaction logs | Backend / Webhooks only |
| `refunds` | `{refundId}` | Refund request & processing status | Admin / Backend |
| `driverEarnings` | `{earningId}` | Per-trip financial ledger for drivers | Backend only |
| `driverSettlements`| `{settlementId}`| Periodic payout batches to driver bank accounts | Backend / Admin |
| `pricingConfigurations` | `{configId}` | Active pricing rules per city & vehicle type | Admin only |
| `serviceAreas` | `{areaId}` | Geographic boundaries & service enabled flag | Admin only |
| `notifications` | `{notificationId}` | User notification feed | Backend only |
| `reviews` | `{reviewId}` | Customer feedback & driver rating | Customer (post-trip) |
| `complaints` | `{complaintId}` | Support tickets & grievance logs | Customer / Driver / Admin |
| `adminAuditLogs` | `{logId}` | Immutable audit trail for all admin actions | Backend / Admin |

---

## 2. Detailed Document Specifications

### `users/{uid}`
```json
{
  "uid": "string (matches Firebase Auth UID)",
  "fullName": "string",
  "email": "string",
  "phone": "string",
  "roles": ["customer", "driver", "admin"],
  "activePortal": "customer | driver | admin",
  "driverVerificationStatus": "not_applied | pending | under_review | approved | rejected | suspended",
  "accountStatus": "active | suspended | deleted",
  "photoURL": "string | null",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

### `driverProfiles/{uid}`
```json
{
  "userId": "string",
  "fullName": "string",
  "email": "string",
  "phone": "string",
  "verificationStatus": "not_applied | pending | under_review | approved | rejected | suspended",
  "onlineStatus": "boolean",
  "activeVehicleId": "string | null",
  "serviceCity": "Coimbatore",
  "rating": "number (default: 5.0)",
  "totalTrips": "number (default: 0)",
  "licenseNumber": "string",
  "licenseExpiry": "timestamp | null",
  "documents": {
    "drivingLicenseUrl": "string | null",
    "aadhaarCardUrl": "string | null"
  },
  "rejectionReason": "string | null",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

### `bookings/{bookingId}`
```json
{
  "bookingId": "string",
  "customerId": "string",
  "driverId": "string | null",
  "vehicleCategoryId": "string",
  "bookingType": "instant | scheduled",
  "scheduledAt": "timestamp | null",
  "bookingStatus": "draft | searching_driver | driver_assigned | driver_arriving | driver_arrived | loading | in_transit | completed | cancelled",
  "pickup": {
    "address": "string",
    "landmark": "string",
    "contactName": "string",
    "contactPhone": "string",
    "latitude": "number",
    "longitude": "number"
  },
  "drop": {
    "address": "string",
    "landmark": "string",
    "contactName": "string",
    "contactPhone": "string",
    "latitude": "number",
    "longitude": "number"
  },
  "goods": {
    "category": "string",
    "description": "string",
    "approxWeightKg": "number",
    "itemCount": "number",
    "isFragile": "boolean",
    "photoUrls": ["string"]
  },
  "helperCount": "0 | 1 | 2",
  "distanceKm": "number",
  "fare": {
    "baseFarePaise": "number",
    "distanceFarePaise": "number",
    "helperFarePaise": "number",
    "taxPaise": "number",
    "discountPaise": "number",
    "totalPaise": "number",
    "pricingVersion": "string"
  },
  "paymentStatus": "pending | paid | failed | refunded",
  "paymentId": "string | null",
  "createdAt": "timestamp",
  "updatedAt": "timestamp",
  "completedAt": "timestamp | null"
}
```
