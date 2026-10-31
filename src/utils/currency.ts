/**
 * Converts integer paise to formatted INR string.
 * e.g., 25000 -> "₹250", 25050 -> "₹250.50"
 */
export function formatPaiseToINR(paise: number): string {
  const rupees = paise / 100;
  if (Number.isInteger(rupees)) {
    return `₹${rupees.toLocaleString("en-IN")}`;
  }
  return `₹${rupees.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}
