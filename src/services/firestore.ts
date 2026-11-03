import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  setDoc,
  updateDoc,
  where,
  orderBy,
  limit,
  DocumentData,
  QueryConstraint,
} from "firebase/firestore";
import { db } from "./firebase";

export const firestoreService = {
  async getDocument<T = DocumentData>(collectionName: string, docId: string): Promise<T | null> {
    const docRef = doc(db, collectionName, docId);
    const snap = await getDoc(docRef);
    if (!snap.exists()) return null;
    return { id: snap.id, ...snap.data() } as T;
  },

  async setDocument<T extends Record<string, any>>(collectionName: string, docId: string, data: T): Promise<void> {
    const docRef = doc(db, collectionName, docId);
    await setDoc(docRef, data, { merge: true });
  },

  async updateDocument(collectionName: string, docId: string, data: Record<string, any>): Promise<void> {
    const docRef = doc(db, collectionName, docId);
    await updateDoc(docRef, data);
  },

  async queryCollection<T = DocumentData>(collectionName: string, ...constraints: QueryConstraint[]): Promise<T[]> {
    const collRef = collection(db, collectionName);
    const q = query(collRef, ...constraints);
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as T));
  },

  listenDocument<T = DocumentData>(
    collectionName: string,
    docId: string,
    onNext: (data: T | null) => void,
    onError?: (error: Error) => void
  ) {
    const docRef = doc(db, collectionName, docId);
    return onSnapshot(
      docRef,
      (snap) => {
        if (!snap.exists()) {
          onNext(null);
        } else {
          onNext({ id: snap.id, ...snap.data() } as T);
        }
      },
      onError
    );
  },

  async checkConnection(): Promise<{ isConnected: boolean; message: string }> {
    try {
      const snap = await getDoc(doc(db, "pricingRules", "healthcheck"));
      return {
        isConnected: true,
        message: `Connected to Firestore (doc exists: ${snap.exists()})`,
      };
    } catch (err: any) {
      if (err?.code === "permission-denied") {
        return {
          isConnected: true,
          message: "Connected to Firestore (Security rules active)",
        };
      }
      return {
        isConnected: false,
        message: err?.message || "Failed to reach Firestore",
      };
    }
  },
};

export { collection, doc, query, where, orderBy, limit, getDoc, getDocs, setDoc, updateDoc, onSnapshot };
