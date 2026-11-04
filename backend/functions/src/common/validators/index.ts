export function isNonEmptyString(val: unknown): val is string {
  return typeof val === 'string' && val.trim().length > 0;
}

export function isValidPhoneNumber(val: unknown): val is string {
  if (typeof val !== 'string') return false;
  // Indian phone number regex: +91 optional, followed by 10 digits starting 6-9
  const cleaned = val.replace(/[\s-]/g, '');
  return /^(\+91)?[6-9]\d{9}$/.test(cleaned);
}

export function isValidEmail(val: unknown): val is string {
  if (typeof val !== 'string') return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
}

export function isValidCoordinate(lat: unknown, lon: unknown): boolean {
  if (typeof lat !== 'number' || typeof lon !== 'number') return false;
  return lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180;
}

export function isPositiveNumber(val: unknown): val is number {
  return typeof val === 'number' && !isNaN(val) && val >= 0;
}
