/**
 * CARRY Design System Theme Colors
 * Extracted directly from Magic Patterns OS design tokens
 */
export const colors = {
  // Magic Patterns core tokens
  ink: "#111111",
  pure: "#000000",
  paper: "#F7F7F7",
  card: "#FFFFFF",
  mist: "#EEEEEE",
  line: "#E2E2E2",
  text: "#171717",
  muted: "#777777",
  disabled: "#BDBDBD",
  error: "#E53935",
  err: "#E53935",
  danger: "#E53935",
  success: "#16A34A",
  warning: "#D97706",

  // Semantic compatibility aliases
  background: "#F7F7F7",
  surface: "#FFFFFF",
  primary: "#111111",
  primaryDark: "#000000",
  secondaryText: "#777777",
  border: "#E2E2E2",
  customerTint: "#F0EDFF",
  driverTint: "#F3F4F6",
  deepNavy: "#111111",
  accent: "#111111",
} as const;

export type ColorKeys = keyof typeof colors;
