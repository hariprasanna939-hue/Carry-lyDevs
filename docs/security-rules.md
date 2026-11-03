# CARRY — Security Rules Documentation

## Firestore Security Architecture

Firestore rules ensure strict role-based access control (RBAC) and data isolation between customers, drivers, and administrators.

### 1. User Profiles (`users/{userId}`)
- **Read**: Authenticated user can read their own profile.
- **Create**: Authenticated user can create their record upon initial sign-up with default `customer` role and `active` status.
- **Update**: Allowed only for personal details (`fullName`, `phone`, `activePortal`, `updatedAt`). Roles and account status cannot be escalated by clients.
- **Delete**: Prevented on client side.

### 2. Driver Profiles (`driverProfiles/{userId}`)
- **Create**: Registered user can submit application with status `pending`.
- **Read**: Driver can view their own verification record and status.
- **Update**: Restricted. Approval and vehicle assignments are executed strictly via Cloud Functions or Admin SDK.

### 3. Bookings (`bookings/{bookingId}`)
- **Read**: Allowed if `request.auth.uid == resource.data.customerId` or `request.auth.uid == resource.data.driverId`.
- **Create**: Allowed by authenticated customer with matching `customerId`. Status must initially be `pending` or `searching`.
- **Update**:
  - Customer can cancel if status is `searching` or `pending`.
  - Assigned driver can update trip lifecycle (`arrived_pickup`, `in_transit`, `completed`) when matching OTP or milestone conditions.

### 4. Cloud Storage Rules
- KYC documents (driving license, vehicle registration RC, fitness certificates) are restricted strictly to the driver and admin.
- File types are constrained to `image/*` and `application/pdf`, capped at 10MB per file.
