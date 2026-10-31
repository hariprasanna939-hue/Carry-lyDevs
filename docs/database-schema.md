# CARRY Database — Phase 1

## users/{uid}
- uid: string
- fullName: string
- email: string
- phone: string
- roles: ["customer"] | ["customer", "driver"]
- activePortal: "customer" | "driver"
- driverVerificationStatus:
  - not_applied
  - pending
  - approved
  - rejected
- accountStatus: "active" | "suspended"
- createdAt: timestamp
- updatedAt: timestamp

## driverProfiles/{uid}
- userId: string
- fullName: string
- email: string
- phone: string
- verificationStatus: "pending" | "approved" | "rejected"
- onlineStatus: boolean
- serviceCity: "Coimbatore"
- createdAt: timestamp
- updatedAt: timestamp

## Future collections
- vehicles
- bookings
- bookingEvents
- driverLocations
- payments
- reviews
- notifications
- pricingRules
- supportTickets
