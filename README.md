# CARRY — On-Demand Moving & Logistics (Phase 1)

CARRY is a logistics and moving platform designed for on-demand mini trucks, vans, and shifting services, launching in Coimbatore, Tamil Nadu.

## Features in Phase 1
- **One App, Two Portals**: Single account architecture with dynamic switching between Customer and Driver modes.
- **Firebase Authentication**: Email and password registration, login, session persistence via AsyncStorage.
- **Firestore User & Driver Profiles**: Role enforcement, account statuses (`active`, `suspended`), and verification workflows (`not_applied`, `pending`, `approved`, `rejected`).
- **Protected Driver Access**: Only approved drivers can access the Driver Portal; customers can apply to become drivers.
- **Strict Firestore Security Rules**: Ensures users cannot self-approve driver status or tamper with roles.

## Project Structure
```
carry/
├── App.tsx                     # Root application flow & portal router
├── app.json                    # Expo project configuration & identifiers
├── package.json                # Project dependencies
├── tsconfig.json               # TypeScript configuration
├── .env.example                # Environment variables template
├── docs/
│   └── database-schema.md      # Firestore schema documentation
├── firebase/
│   └── firestore.rules         # Security rules for users and driver profiles
└── src/
    ├── auth/
    │   └── AuthContext.tsx     # Authentication & portal context
    ├── components/
    │   └── CarryButton.tsx     # Reusable action button component
    ├── firebase/
    │   └── firebase.ts         # Firebase initialization & client config
    ├── screens/
    │   ├── CustomerHomeScreen.tsx
    │   ├── DriverHomeScreen.tsx
    │   ├── LoginScreen.tsx
    │   ├── PortalScreen.tsx
    │   └── RegisterScreen.tsx
    ├── theme/
    │   └── colors.ts           # Design tokens & color palette
    └── types/
        └── user.ts             # TypeScript definitions for users & portals
```

## Getting Started

### 1. Configure Firebase
1. Create a Firebase project in [Firebase Console](https://console.firebase.google.com/).
2. Enable **Email/Password** in Authentication.
3. Create a **Firestore Database** (recommended: India region like `asia-south1`).
4. Register a Web App in Firebase to get the config keys.
5. Create a `.env` file in the project root:
   ```env
   EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key
   EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```
   Or update `src/firebase/firebase.ts` directly.

### 2. Deploy Firestore Security Rules
Copy the rules from `firebase/firestore.rules` and publish them in Firebase Console -> Firestore Database -> Rules.

### 3. Run the App
```bash
# Check TypeScript
npx tsc --noEmit

# Start the Expo development server
npx expo start --clear
```
