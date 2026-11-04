import { HttpsError, FunctionsErrorCode } from 'firebase-functions/v2/https';

export { FunctionsErrorCode };

export class AppError extends Error {
  public readonly code: FunctionsErrorCode;
  public readonly details?: unknown;

  constructor(code: FunctionsErrorCode, message: string, details?: unknown) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.details = details;
    Object.setPrototypeOf(this, new.target.prototype);
  }

  public toHttpsError(): HttpsError {
    return new HttpsError(this.code, this.message, this.details);
  }
}
