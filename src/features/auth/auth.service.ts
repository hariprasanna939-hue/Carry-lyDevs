import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../../services/firebase";
import { RegisterPayload } from "./auth.types";
import { CarryUser } from "../../types/user";

export const authService = {
  async register(payload: RegisterPayload): Promise<CarryUser> {
    const password = payload.password || "Carry@1234";
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      payload.email.trim(),
      password
    );

    const uid = userCredential.user.uid;
    const userData: CarryUser = {
      uid,
      name: payload.fullName.trim(),
      fullName: payload.fullName.trim(),
      email: payload.email.trim(),
      phone: payload.phone.trim(),
      roles: payload.role === "driver" ? ["customer", "driver"] : ["customer"],
      activePortal: payload.role === "driver" ? "driver" : "customer",
      photoURL: "",
      driverVerificationStatus: payload.role === "driver" ? "pending" : "not_applied",
      accountStatus: "active",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await setDoc(doc(db, "users", uid), userData);
    return userData;
  },

  async login(email: string, password: string): Promise<CarryUser | null> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
      const snap = await getDoc(doc(db, "users", userCredential.user.uid));
      if (snap.exists()) {
        const data = snap.data();
        return {
          uid: snap.id,
          name: data.name || data.fullName || "",
          fullName: data.fullName || data.name || "",
          ...data,
        } as CarryUser;
      }

      // Safe recovery: create base customer profile if Auth exists but Firestore doc is missing
      const recoveredData: CarryUser = {
        uid: userCredential.user.uid,
        name: userCredential.user.displayName || "Customer",
        fullName: userCredential.user.displayName || "Customer",
        email: userCredential.user.email || email.trim().toLowerCase(),
        phone: userCredential.user.phoneNumber || "",
        roles: ["customer"],
        activePortal: "customer",
        photoURL: "",
        driverVerificationStatus: "not_applied",
        accountStatus: "active",
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      await setDoc(doc(db, "users", userCredential.user.uid), recoveredData);
      return recoveredData;
    } catch (err: any) {
      console.error("Firebase login error [", err?.code, "]:", err?.message);
      throw err;
    }
  },

  async logout(): Promise<void> {
    await signOut(auth);
  },

  async resetPassword(email: string): Promise<void> {
    await sendPasswordResetEmail(auth, email.trim());
  },
};
