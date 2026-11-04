# CARRY — Backend Deployment & Operations Guide

Step-by-step instructions for running the CARRY backend locally via the Firebase Emulator Suite and deploying to production.

---

## 1. Prerequisites

- **Node.js**: `v20.x` or higher (`node -v`).
- **Firebase CLI**: `npm install -g firebase-tools` (`firebase --version`).
- **Active Project**: `carry-bd2d7` (Region: `asia-south1`).

---

## 2. Local Development with Firebase Emulator Suite

The CARRY backend is pre-configured with emulators in [`firebase.json`](file:///Users/prasannahari/Projects/carry/backend/firebase.json):

| Emulator | Port | Purpose |
|---|---|---|
| **Auth** | `9099` | Local authentication testing without quota usage |
| **Functions** | `5001` | Local execution of callable functions & triggers |
| **Firestore** | `8080` | Local database with live security rule testing |
| **Storage** | `9199` | Local file uploads (KYC, vehicle photos, PODs) |
| **Emulator UI** | `4000` | Web dashboard to inspect data and send notifications |

### Starting Emulators
From the `backend` directory:
```bash
cd backend
firebase emulators:start
```

Open the Emulator UI at: `http://localhost:4000`

---

## 3. Environment Variables Configuration

Copy template into `.env` within `backend/functions`:
```bash
cd backend
cp .env.example functions/.env
```

Set production credentials in Google Cloud Secret Manager or Firebase Environment:
```bash
firebase functions:secrets:set RAZORPAY_KEY_SECRET
firebase functions:secrets:set RAZORPAY_WEBHOOK_SECRET
```

---

## 4. Building the Backend

Before deploying, build and verify all TypeScript modules:
```bash
cd backend/functions
npm run build
npm test
```
The test runner executes all 10 phases sequentially. Verify that all phases pass with 100% assertions.

---

## 5. Deployment Commands

### Deploy All Backend Components
```bash
cd backend
firebase deploy
```

### Targeted Deployments
```bash
# Deploy Firestore security rules and indexes
firebase deploy --only firestore:rules,firestore:indexes

# Deploy Storage security rules
firebase deploy --only storage:rules

# Deploy Cloud Functions only
firebase deploy --only functions
```

---

## 6. Post-Deployment Verification Checklist

1. **Verify Security Rules**: Confirm rules are active in the Firebase Console under Firestore & Storage Rules tabs.
2. **Verify Functions**: Confirm that all 30 callable functions appear under Cloud Functions Console in `asia-south1`.
3. **Verify Project Configuration**:
   ```bash
   firebase use
   # Active project: carry-bd2d7 (default)
   ```
4. **Verify Client App**: Run `npm run typecheck` in the root mobile project to verify 100% clean frontend compatibility.
