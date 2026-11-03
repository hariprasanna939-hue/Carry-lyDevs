# CARRY — Application Architecture

## 1. Overview
CARRY is an on-demand intra-city logistics and goods transportation platform built specifically for Indian tier-1 and tier-2 markets, launched first in Coimbatore, Tamil Nadu.

It enables customers (B2C & B2B) to book mini-trucks, cargo 3-wheelers, and pickup trucks with transparent upfront pricing, optional helper assistance, real-time live GPS tracking, and cash/UPI payment collection.

## 2. Tech Stack
- **Frontend / Client**: React Native with Expo SDK 58, Expo Router file-based routing, TypeScript.
- **State Management**: Zustand / React hooks context for portal switching and booking draft state.
- **Backend & Cloud**:
  - Firebase Authentication (Phone OTP, Email/Password)
  - Cloud Firestore (Realtime database with strict security rules)
  - Cloud Functions (Node.js/TypeScript backend for matching, pricing, driver assignment, webhook handling)
  - Firebase Storage (Driver KYC documents, delivery verification photos)
- **Maps & Location**: Google Maps SDK / React Native Maps, Expo Location, Directions API.

## 3. Directory Layout
```
carry/
├── app/                  # Expo Router navigation (file-based screens)
│   ├── (auth)/           # Authentication screens (login, register, reset, role switch)
│   ├── (customer)/       # Customer booking flow, history, live tracking
│   ├── (driver)/         # Driver onboarding, live jobs, trip execution, earnings
│   └── (shared)/         # Notifications, settings, support, terms
├── src/
│   ├── components/       # Reusable UI primitives and domain widgets
│   ├── features/         # Domain-driven service & validation modules
│   ├── hooks/            # Custom reusable React hooks
│   ├── services/         # Firebase, Firestore, Maps, Location API services
│   ├── store/            # State stores (Auth, Booking, Portal)
│   ├── types/            # TypeScript interfaces and domain schemas
│   ├── constants/        # Rates, vehicle definitions, statuses, app config
│   ├── utils/            # Currency formatting (INR), dates, validation helpers
│   └── theme/            # Design tokens, typography, colors, layout spacing
├── functions/            # Cloud Functions backend (TypeScript)
├── firebase/             # Firestore & Cloud Storage security rules and indexes
└── docs/                 # System and technical documentation
```

## 4. Key Architectural Patterns
- **Dual-Portal Single App**: One app binary supports both customers and registered/verified drivers via an active portal selector.
- **Secure Transaction Boundaries**: Fare calculation and booking matching are handled or verified server-side with Cloud Functions.
- **Offline & Reconnection Resilience**: Real-time Firestore listeners with local caching for trip statuses.
