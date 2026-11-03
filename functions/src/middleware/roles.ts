import { db } from "../config";
import { UserRole } from "../types";

export async function requireUserRole(uid: string, requiredRole: UserRole): Promise<void> {
  const userDoc = await db.collection("users").doc(uid).get();
  if (!userDoc.exists) {
    throw new Error("User does not exist");
  }
  const data = userDoc.data();
  const roles: string[] = data?.roles || [];
  if (!roles.includes(requiredRole)) {
    throw new Error(`Forbidden: Requires role ${requiredRole}`);
  }
}
