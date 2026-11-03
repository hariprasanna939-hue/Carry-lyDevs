/**
 * CARRY Firebase Development-Only Logger
 * Securely logs diagnostic details for Firebase operations without leaking
 * passwords, auth tokens, full identity document numbers, or bank account details.
 */

export interface FirebaseLogContext {
  operation: "getDoc" | "setDoc" | "updateDoc" | "addDoc" | "storage_upload" | "auth_check";
  collectionOrBucket: string;
  documentPath: string;
  authenticatedUid?: string | null;
  accountRole?: string | string[] | null;
  onboardingStatus?: string | null;
  approvalStatus?: string | null;
  error?: any;
}

export function logFirebaseDevOp(context: FirebaseLogContext) {
  if (!__DEV__) return;

  const timestamp = new Date().toISOString();
  const uid = context.authenticatedUid || "UNAUTHENTICATED";
  const role = Array.isArray(context.accountRole)
    ? context.accountRole.join(", ")
    : context.accountRole || "unknown";

  if (context.error) {
    const code = context.error?.code || "unknown-code";
    const message = context.error?.message || String(context.error);
    console.error(
      `[FIREBASE_DEV_ERROR] [${timestamp}]\n` +
      `  • Operation: ${context.operation}\n` +
      `  • Path: ${context.collectionOrBucket}/${context.documentPath}\n` +
      `  • Auth UID: ${uid}\n` +
      `  • Account Role: ${role}\n` +
      `  • Onboarding Status: ${context.onboardingStatus || "N/A"}\n` +
      `  • Approval Status: ${context.approvalStatus || "N/A"}\n` +
      `  • Code: ${code}\n` +
      `  • Message: ${message}`
    );
  } else {
    console.log(
      `[FIREBASE_DEV_OP] [${timestamp}]\n` +
      `  • Operation: ${context.operation}\n` +
      `  • Path: ${context.collectionOrBucket}/${context.documentPath}\n` +
      `  • Auth UID: ${uid}\n` +
      `  • Account Role: ${role}\n` +
      `  • Onboarding Status: ${context.onboardingStatus || "N/A"}\n` +
      `  • Approval Status: ${context.approvalStatus || "N/A"}`
    );
  }
}
