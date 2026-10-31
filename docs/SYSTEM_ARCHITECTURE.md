# CARRY — System Architecture

## 1. High-Level Architecture

```
                      +-----------------------------+
                      |       CARRY Mobile App      |
                      |   React Native (Expo SDK)   |
                      |          TypeScript         |
                      +--------------+--------------+
                                     |
                       Firebase Authentication (JWT)
                                     |
       +-----------------------------+-----------------------------+
       |                             |                             |
       v                             v                             v
+--------------+              +--------------+              +--------------+
|   Customer   |              |    Driver    |              |    Admin     |
|    Portal    |              |    Portal    |              |    Portal    |
+--------------+              +--------------+              +--------------+
       |                             |                             |
       +-----------------------------+-----------------------------+
                                     |
                     +---------------+---------------+
                     |                               |
                     v                               v
           +--------------------+          +--------------------+
           |  Cloud Firestore   |          |  Cloud Functions   |
           |  (Real-time sync   |          |  (Trusted Backend: |
           |   & security rules)|          |   Dispatch, Fares, |
           +--------------------+          |   Auth & Webhooks) |
                     |                     +--------------------+
                     |                               |
        +------------+------------+                  |
        |                         |                  v
        v                         v           +--------------+
+---------------+         +---------------+   |  Razorpay    |
|   Firebase    |         |   Google Maps |   |  Payment     |
|   Storage     |         |   Platform    |   |  Gateway     |
+---------------+         +---------------+   +--------------+
```

## 2. Component Layers
1. **Presentation & Navigation**:
   - Expo React Native with TypeScript.
   - Design system built with tokens in `src/theme/colors.ts`.
   - Accessible, atomic components in `src/components/`.
2. **State & Context**:
   - `AuthContext`: Central auth session, current user roles, active portal mode.
   - Persistence backed by `@react-native-async-storage/async-storage`.
3. **Data Access (Repositories & Services)**:
   - Client queries restricted by security rules.
   - Sensitive mutations (pricing calculation, assignment, status milestone confirmation, refunds) handled by Cloud Functions.
4. **Third-Party Integrations**:
   - Google Maps API (Directions, Distance Matrix, Geocoding).
   - Razorpay PG (Order creation & webhook signature verification).
   - Expo Push Service / FCM (Push notifications).
