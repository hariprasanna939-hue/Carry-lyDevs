import { auth } from "../config";

export async function verifyAuthToken(header?: string): Promise<string> {
  if (!header || !header.startsWith("Bearer ")) {
    throw new Error("Unauthorized: Missing or malformed authorization header");
  }
  const token = header.split("Bearer ")[1];
  const decoded = await auth.verifyIdToken(token);
  return decoded.uid;
}
