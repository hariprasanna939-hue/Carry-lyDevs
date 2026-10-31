# CARRY — Testing Strategy & Quality Assurance

## 1. Test Levels
- **TypeScript Static Verification**: `npx tsc --noEmit` must pass with 0 errors on every commit.
- **Unit & Logic Tests**: Fare calculations, distance rounding, date validation, and status transitions.
- **Security Rule Emulator Tests**: Verifying that unauthenticated requests, unauthorized role escalations, and cross-user data tampering are rejected.
- **Device & Smoke Tests**: Testing on physical iOS (iPhone) and Android devices via Expo Go and development builds.

## 2. Test Scenarios per Phase
- **Phase 0 & 1**:
  - Registration with duplicate email rejected.
  - Session persists upon cold app restart.
  - Switching to driver portal fails when driver status is `pending` or `not_applied`.
  - Manual approval in Firestore immediately unlocks Driver Portal upon refresh.
- **Phase 2 & 3**:
  - Coimbatore geofencing: coordinates outside Coimbatore return an error.
  - Fare calculation: base + km + helper correctly aggregates in paise.
- **Phase 4 & 5**:
  - Race condition test: Two drivers accepting the same booking simultaneously; exactly one driver succeeds while the second receives an offer expired response.
