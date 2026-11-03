import { db } from "../../config";

export async function onUserCreated(uid: string, email?: string, phone?: string) {
  const userRef = db.collection("users").doc(uid);
  const existing = await userRef.get();
  if (!existing.exists) {
    await userRef.set({
      uid,
      email: email || "",
      phone: phone || "",
      roles: ["customer"],
      activePortal: "customer",
      driverVerificationStatus: "not_applied",
      accountStatus: "active",
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
}
