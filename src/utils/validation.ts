export function isValidPhone(phone: string): boolean {
  // Validates standard 10-digit Indian phone numbers
  const cleaned = phone.replace(/\D/g, "");
  return cleaned.length === 10 || (cleaned.length === 12 && cleaned.startsWith("91"));
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

export function isValidVehicleNumber(plateNumber: string): boolean {
  // Basic validation for Indian vehicle registration plates (e.g. TN38AB1234 or TN-38-AB-1234)
  const cleaned = plateNumber.replace(/[\s-]/g, "").toUpperCase();
  return /^[A-Z]{2}[0-9]{1,2}[A-Z]{1,3}[0-9]{4}$/.test(cleaned);
}
