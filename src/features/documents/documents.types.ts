export type DocumentType =
  | "driving_license"
  | "rc_book"
  | "insurance"
  | "aadhar"
  | "vehicle_photo";

export interface UploadedDocument {
  type: DocumentType;
  fileUrl: string;
  verified: boolean;
  uploadedAt: unknown;
}
