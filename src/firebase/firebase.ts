import AsyncStorage from "@react-native-async-storage/async-storage";
import { FirebaseApp, getApp, getApps, initializeApp } from "firebase/app";
import {
  Auth,
  getAuth,
  // @ts-expect-error - getReactNativePersistence is provided by React Native bundle of firebase/auth
  getReactNativePersistence,
  initializeAuth,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey:
    process.env.EXPO_PUBLIC_FIREBASE_API_KEY ||
    "AIzaSyBv7J5a-exJ0Xnur4j9UbMjjPXU3r-PDdo",
  authDomain:
    process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN ||
    "carry-bd2d7.firebaseapp.com",
  projectId:
    process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID ||
    "carry-bd2d7",
  storageBucket:
    process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET ||
    "carry-bd2d7.firebasestorage.app",
  messagingSenderId:
    process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ||
    "414107813503",
  appId:
    process.env.EXPO_PUBLIC_FIREBASE_APP_ID ||
    "1:414107813503:android:051bc84170b1c9317e214a",
};

const app: FirebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);

let auth: Auth;

try {
  const persistence =
    typeof getReactNativePersistence === "function"
      ? getReactNativePersistence(AsyncStorage)
      : undefined;

  auth = initializeAuth(app, {
    persistence,
  });
} catch (error: any) {
  if (
    error?.code === "auth/already-initialized" ||
    error?.message?.includes("already-initialized")
  ) {
    auth = getAuth(app);
  } else {
    try {
      auth = getAuth(app);
    } catch {
      console.error("Firebase auth initialization error:", error);
      throw error;
    }
  }
}

const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
