import { isValidEmail, isValidPhone } from "../../utils/validation";
import { RegisterPayload } from "./auth.types";

export function validateRegisterInput(data: RegisterPayload): { isValid: boolean; error?: string } {
  if (!data.fullName || data.fullName.trim().length < 2) {
    return { isValid: false, error: "Please enter your full name." };
  }
  if (!isValidEmail(data.email)) {
    return { isValid: false, error: "Please enter a valid email address." };
  }
  if (!isValidPhone(data.phone)) {
    return { isValid: false, error: "Please enter a valid 10-digit mobile number." };
  }
  if (data.password && data.password.length < 6) {
    return { isValid: false, error: "Password must be at least 6 characters long." };
  }
  return { isValid: true };
}

export function validateLoginInput(email: string, password?: string): { isValid: boolean; error?: string } {
  if (!isValidEmail(email)) {
    return { isValid: false, error: "Please enter a valid email address." };
  }
  if (password !== undefined && password.length < 6) {
    return { isValid: false, error: "Password must be at least 6 characters." };
  }
  return { isValid: true };
}
