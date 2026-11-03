const https = require("https");
const { initializeApp } = require("firebase/app");
const { getFirestore, doc, getDoc, enableIndexedDbPersistence } = require("firebase/firestore");
const { getAuth } = require("firebase/auth");

const config = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || "AIzaSyBv7J5a-exJ0Xnur4j9UbMjjPXU3r-PDdo",
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || "carry-bd2d7.firebaseapp.com",
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || "carry-bd2d7",
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || "carry-bd2d7.firebasestorage.app",
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "414107813503",
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || "1:414107813503:android:051bc84170b1c9317e214a",
};

console.log("=========================================");
console.log("🔥 CARRY — Firebase Connectivity Diagnostic");
console.log("=========================================");
console.log(`Project ID:        ${config.projectId}`);
console.log(`Auth Domain:       ${config.authDomain}`);
console.log(`Storage Bucket:    ${config.storageBucket}`);
console.log(`App ID:            ${config.appId}`);
console.log("-----------------------------------------");

// Step 1: Check HTTPS connection to Firebase API
function checkNetworkEndpoint() {
  return new Promise((resolve) => {
    const req = https.get(`https://firestore.googleapis.com/v1/projects/${config.projectId}/databases/(default)`, (res) => {
      console.log(`[1] Google Firestore API Status: HTTP ${res.statusCode} (${res.statusMessage})`);
      if (res.statusCode === 200 || res.statusCode === 403 || res.statusCode === 404 || res.statusCode === 401) {
        // Any HTTP response from googleapis.com means network & DNS routing to Google Cloud are healthy
        resolve(true);
      } else {
        resolve(false);
      }
    });
    req.on("error", (err) => {
      console.log(`[1] Google Firestore API unreachable: ${err.message}`);
      resolve(false);
    });
    req.setTimeout(5000, () => {
      req.destroy();
      console.log("[1] Google Firestore API connection timed out.");
      resolve(false);
    });
  });
}

// Step 2: Initialize Firebase App & Firestore SDK
async function testFirestoreSDK() {
  try {
    const app = initializeApp(config);
    const db = getFirestore(app);
    const auth = getAuth(app);

    console.log("[2] Firebase Client SDK Initialized successfully.");

    // Step 3: Perform actual Firestore Document Fetch
    try {
      const snap = await getDoc(doc(db, "pricingRules", "coimbatore_default"));
      console.log(`[3] Firestore Query executed. Document exists: ${snap.exists()}`);
      console.log("-----------------------------------------");
      console.log("✅ RESULT: Firebase Firestore is fully CONNECTED and ACTIVE!");
    } catch (fsErr) {
      if (fsErr.code === "permission-denied") {
        console.log(`[3] Firestore Query reached Google Cloud: Server responded with '${fsErr.code}'.`);
        console.log("    (Security rules are active and enforcing access control).");
        console.log("-----------------------------------------");
        console.log("✅ RESULT: Firebase Firestore is CONNECTED and SECURED by Security Rules!");
      } else {
        console.log(`[3] Firestore Query returned code: ${fsErr.code} - ${fsErr.message}`);
        console.log("-----------------------------------------");
        console.log("⚠️ RESULT: Firestore responded with unexpected code:", fsErr.code);
      }
    }
  } catch (err) {
    console.error("❌ SDK Error:", err.message);
  }
}

async function run() {
  const netOk = await checkNetworkEndpoint();
  if (!netOk) {
    console.log("⚠️ Could not reach firestore.googleapis.com. Check your internet connection.");
  }
  await testFirestoreSDK();
  console.log("=========================================");
  process.exit(0);
}

run();
