export function validateEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email.trim().toLowerCase());
}

export function validatePhone(phone: string): boolean {
  // Indian 10-digit mobile number format
  const cleaned = phone.replace(/\D/g, "");
  return cleaned.length === 10;
}

export function validatePassword(password: string): {
  isValid: boolean;
  message?: string;
} {
  if (password.length < 6) {
    return {
      isValid: false,
      message: "Password must be at least 6 characters long.",
    };
  }
  return { isValid: true };
}
