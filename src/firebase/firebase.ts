import AsyncStorage from "@react-native-async-storage/async-storage";
import { FirebaseApp, getApp, getApps, initializeApp } from "firebase/app";
import {
  Auth,
  getAuth,
  // @ts-expect-error - getReactNativePersistence is available in React Native environment
  getReactNativePersistence,
  initializeAuth,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

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

function createFirebaseAuth(firebaseApp: FirebaseApp): Auth {
  try {
    return initializeAuth(firebaseApp, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  } catch {
    // Auth may already be initialized during development reload.
    return getAuth(firebaseApp);
  }
}

export const auth = createFirebaseAuth(app);
export const db = getFirestore(app);
