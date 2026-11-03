import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { app } from "../firebase/firebase";

export const storage = getStorage(app as any);

export async function uploadFile(
  path: string,
  blob: Blob | Uint8Array | ArrayBuffer,
  metadata?: Record<string, any>
): Promise<string> {
  const fileRef = ref(storage, path);
  const uploadTask = await uploadBytesResumable(fileRef, blob, metadata);
  return await getDownloadURL(uploadTask.ref);
}
