/**
 * CARRY Monochrome Design System Theme Colors
 * Pure Black & White Minimalist Identity
 * Overrides all previous color definitions.
 */
export const colors = {
  // Pure monochrome palette
  pureBlack: "#000000",
  primaryBlack: "#111111",
  mainText: "#171717",
  white: "#FFFFFF",
  background: "#F7F7F7",
  cardSurface: "#FFFFFF",
  lightGrey: "#EEEEEE",
  borderGrey: "#E2E2E2",
  secondaryText: "#777777",
  disabledGrey: "#BDBDBD",

  // Monochrome semantic statuses (communicated through icons, shapes & shades)
  success: "#444444",
  warning: "#666666",
  error: "#222222",
  danger: "#222222",

  // Compatibility tokens matching the exact monochrome palette
  pure: "#000000",
  ink: "#111111",
  text: "#171717",
  card: "#FFFFFF",
  paper: "#F7F7F7",
  mist: "#EEEEEE",
  line: "#E2E2E2",
  muted: "#777777",
  disabled: "#BDBDBD",
  err: "#222222",

  surface: "#FFFFFF",
  primary: "#111111",
  primaryDark: "#000000",
  border: "#E2E2E2",
  customerTint: "#EEEEEE",
  driverTint: "#EEEEEE",
  deepNavy: "#111111",
  accent: "#111111",
} as const;

export type ColorKeys = keyof typeof colors;
