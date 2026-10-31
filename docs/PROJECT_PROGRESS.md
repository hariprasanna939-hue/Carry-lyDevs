# CARRY — Project Implementation Progress

> Operating Market: Coimbatore, Tamil Nadu, India  
> Tech Stack: React Native + Expo (TypeScript), Firebase Auth, Cloud Firestore, Firebase Storage, Cloud Functions

---

## Phases Overview

- [x] **Phase 0 — Project Foundation** *(Current)*
  - [x] Expo and TypeScript project structure setup
  - [x] Firebase SDK initialization with client configuration
  - [x] Brand theme tokens & reusable UI components (`CarryButton`, `CarryInput`, `CarryCard`, `CarryBadge`, `CarryHeader`, `CarryEmptyState`)
  - [x] Application identity & Google Services linked (`com.carry`)
  - [x] Complete architecture documentation suite in `docs/`
  - [x] TypeScript verification (`npx tsc --noEmit` passing with 0 errors)

- [ ] **Phase 1 — Authentication & Portal System**
  - [x] Customer registration with Firestore user profile
  - [x] Email/password login and persistent session (AsyncStorage)
  - [x] Secure portal router (Customer, Driver)
  - [x] Customer to Driver application submission (`pending` state)
  - [x] Protected Driver portal access (only `approved` drivers)
  - [ ] Forgot password flow & email validation polish
  - [ ] Comprehensive role escalation guards (Admin role support)

- [ ] **Phase 2 — Driver Onboarding & Vehicle Management**
  - [ ] Personal details & KYC document collection
  - [ ] Commercial vehicle registration (Tata Ace, Pickup, 3-Wheeler)
  - [ ] RC, insurance, fitness certificate upload placeholders
  - [ ] Verification status tracker (`not_applied`, `pending`, `under_review`, `approved`, `rejected`)
  - [ ] Driver availability toggle (Online/Offline) foundation

- [ ] **Phase 3 — Customer Booking Engine (Coimbatore)**
  - [ ] Pickup & drop address selection & Coimbatore geofence validation
  - [ ] Instant vs. scheduled booking selection
  - [ ] Vehicle category selection with capacity & dimensions
  - [ ] Goods classification, item count & handling instructions
  - [ ] Helper selection (Driver only, 1 helper, 2 helpers)
  - [ ] Server-validated fare calculation (base fare, distance rate, helpers, taxes in paise)
  - [ ] Booking confirmation & Firestore persistence

- [ ] **Phase 4 — Driver Request & Trip Management**
  - [ ] Real-time incoming booking offer card with timeout
  - [ ] Accept/Reject booking offers
  - [ ] Atomic assignment enforcement
  - [ ] Trip lifecycle milestones: Arrived at pickup -> Loading -> In Transit -> Delivered
  - [ ] Driver trip history

- [ ] **Phase 5 — Dispatch & Driver Matching Engine**
  - [ ] Eligible driver discovery based on vehicle type & Coimbatore service area
  - [ ] Driver ranking & broadcast/sequential offer engine
  - [ ] Cloud Function atomic assignment via Firestore transaction
  - [ ] Offer expiry and fallback to next eligible driver

- [ ] **Phase 6 — Maps & Live Tracking**
  - [ ] Google Maps Platform integration (Directions & Geocoding)
  - [ ] Route display between pickup and drop
  - [ ] Driver location publisher (while on active trip)
  - [ ] Customer live tracking screen with dynamic ETA

- [ ] **Phase 7 — Payments & Financial Ledger**
  - [ ] Razorpay backend order generation
  - [ ] Mobile checkout SDK integration
  - [ ] Webhook signature verification on backend
  - [ ] Driver earnings calculation & platform commission deductions
  - [ ] Digital receipts & transaction history

- [ ] **Phase 8 — Notifications & In-App Communication**
  - [ ] Expo Push Notification token registration
  - [ ] Milestone push alerts for customers & drivers
  - [ ] Scheduled booking alerts
  - [ ] Customer-to-driver masked call / support ticket triggers

- [ ] **Phase 9 — Operations & Administration Portal**
  - [ ] Secure in-app admin dashboard for authorized roles
  - [ ] Driver document review & approval/rejection actions
  - [ ] Vehicle verification
  - [ ] Live booking monitors & manual reassignments
  - [ ] Immutable audit logs

- [ ] **Phase 10 — Quality, Security & Production Release**
  - [ ] Security rules audit (Firestore + Storage)
  - [ ] Performance profiling & offline behavior
  - [ ] Account deletion & compliance
  - [ ] EAS production build profiles (Android APK/AAB & iOS)
