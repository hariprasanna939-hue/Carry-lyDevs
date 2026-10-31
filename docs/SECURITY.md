# CARRY — Security & Authorization Architecture

## 1. Principles of Security
1. **Least Privilege**: Users and drivers access strictly the data associated with their own UID or active booking.
2. **Server-Side Trust**: Critical operations (driver approvals, fare calculations, dispatch matching, payment reconciliation) are executed on trusted server environments (Cloud Functions) and never trusted from mobile client payloads.
3. **Immutability of Ledgers**: Financial records (`driverEarnings`, `payments`, `adminAuditLogs`) cannot be directly updated or deleted by mobile clients.
4. **Environment Isolation**: Production secrets (payment gateway secret keys, Google Maps server keys, Firebase service account credentials) are strictly kept out of client bundles and mobile code.

## 2. Firestore Rule Enforcements
- `users`: Write updates restricted to `fullName`, `phone`, `activePortal`. Transitions into privileged roles or `approved` status are forbidden client-side.
- `driverProfiles`: Direct updates to `verificationStatus` or `rating` are forbidden.
- `bookings`: Customers cannot view other customers' bookings. Drivers can only view bookings where `driverId == auth.uid` or an active offer exists.
- `payments`: Clients have read access to their own payment receipts; only trusted backend service accounts write payment confirmations.
