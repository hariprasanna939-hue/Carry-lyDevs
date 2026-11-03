import { uploadFile } from "../../services/storage";
import { DocumentType } from "./documents.types";

export const documentsService = {
  async uploadDriverDoc(
    userId: string,
    type: DocumentType,
    blob: Blob | Uint8Array | ArrayBuffer
  ): Promise<string> {
    const path = `driver_documents/${userId}/${type}_${Date.now()}`;
    return await uploadFile(path, blob);
  },
};
