import * as admin from "firebase-admin";

if (!admin.apps.length) {
  admin.initializeApp();
}

export const db = admin.firestore();
export const auth = admin.auth();
export const storage = admin.storage();

export const config = {
  region: "asia-south1", // Mumbai region for lowest latency in India / Tamil Nadu
  defaultCurrency: "INR",
  commissionPercent: 15,
};
