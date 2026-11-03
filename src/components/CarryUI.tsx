import React, { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { AlertCircle, ChevronLeft, Eye, EyeOff } from "lucide-react-native";
import { colors } from "../theme/colors";

/**
 * Primary & Secondary CARRY Buttons
 */
export function CarryButton({
  children,
  onPress,
  variant = "primary",
  size = "lg",
  disabled = false,
  loading = false,
  icon,
}: {
  children: React.ReactNode;
  onPress?: () => void;
  variant?: "primary" | "secondary" | "ghost" | "inverse" | "danger";
  size?: "lg" | "md" | "sm";
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
}) {
  const isPrimary = variant === "primary";
  const isSecondary = variant === "secondary";
  const isGhost = variant === "ghost";
  const isInverse = variant === "inverse";
  const isDanger = variant === "danger";

  let bg: string = colors.ink;
  let textColor: string = "#FFFFFF";
  let borderColor: string = "transparent";

  if (isSecondary) {
    bg = colors.card;
    textColor = colors.text;
    borderColor = colors.line;
  } else if (isGhost) {
    bg = "transparent";
    textColor = colors.text;
  } else if (isInverse) {
    bg = "#FFFFFF";
    textColor = colors.ink;
  } else if (isDanger) {
    bg = colors.error;
    textColor = "#FFFFFF";
  }

  if (disabled) {
    bg = isSecondary ? colors.card : colors.disabled;
    textColor = isSecondary ? colors.disabled : "#FFFFFF";
    borderColor = colors.line;
  }

  const height = size === "lg" ? 54 : size === "md" ? 46 : 38;
  const radius = size === "lg" ? 16 : 12;

  return (
    <Pressable
      onPress={disabled || loading ? undefined : onPress}
      style={({ pressed }) => [
        styles.buttonBase,
        {
          height,
          borderRadius: radius,
          backgroundColor: bg,
          borderColor,
          borderWidth: isSecondary ? 1 : 0,
          opacity: pressed && !disabled ? 0.9 : 1,
        },
      ]}
      accessibilityRole="button"
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={isSecondary ? colors.ink : "#FFFFFF"}
        />
      ) : (
        <View style={styles.buttonContent}>
          {icon && <View style={styles.buttonIcon}>{icon}</View>}
          <Text
            style={[
              styles.buttonText,
              {
                color: textColor,
                fontSize: size === "lg" ? 16 : 14,
              },
            ]}
          >
            {children}
          </Text>
        </View>
      )}
    </Pressable>
  );
}

/**
 * Circle Icon button
 */
export function CarryIconButton({
  children,
  onPress,
  variant = "plain",
}: {
  children: React.ReactNode;
  onPress?: () => void;
  variant?: "plain" | "outline" | "solid";
}) {
  let bg = "transparent";
  let border = "transparent";
  if (variant === "outline") {
    bg = colors.card;
    border = colors.line;
  } else if (variant === "solid") {
    bg = colors.ink;
  }

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.iconButton,
        {
          backgroundColor: bg,
          borderColor: border,
          borderWidth: variant === "outline" ? 1 : 0,
          opacity: pressed ? 0.8 : 1,
        },
      ]}
    >
      {children}
    </Pressable>
  );
}

/**
 * TopBar navigation with back button and title
 */
export function CarryTopBar({
  title,
  subtitle,
  onBack,
  right,
  large = false,
  dark = false,
}: {
  title?: string;
  subtitle?: string;
  onBack?: () => void;
  right?: React.ReactNode;
  large?: boolean;
  dark?: boolean;
}) {
  return (
    <View style={[styles.topBar, dark && { backgroundColor: colors.ink }]}>
      <View style={styles.topBarRow}>
        {onBack ? (
          <CarryIconButton onPress={onBack} variant="plain">
            <ChevronLeft
              size={24}
              color={dark ? "#FFFFFF" : colors.text}
              strokeWidth={2.4}
            />
          </CarryIconButton>
        ) : (
          <View style={{ width: 8 }} />
        )}

        {!large && title && (
          <View style={styles.topBarCenter}>
            <Text
              style={[
                styles.topBarTitle,
                { color: dark ? "#FFFFFF" : colors.text },
              ]}
              numberOfLines={1}
            >
              {title}
            </Text>
            {subtitle && (
              <Text
                style={[
                  styles.topBarSubtitle,
                  { color: dark ? "rgba(255,255,255,0.7)" : colors.muted },
                ]}
              >
                {subtitle}
              </Text>
            )}
          </View>
        )}

        <View style={styles.topBarRight}>{right}</View>
      </View>

      {large && title && (
        <View style={styles.largeHeadingWrapper}>
          <Text
            style={[
              styles.largeHeading,
              { color: dark ? "#FFFFFF" : colors.ink },
            ]}
          >
            {title}
          </Text>
          {subtitle && (
            <Text
              style={[
                styles.topBarSubtitle,
                {
                  color: dark ? "rgba(255,255,255,0.7)" : colors.muted,
                  marginTop: 4,
                  fontSize: 15,
                },
              ]}
            >
              {subtitle}
            </Text>
          )}
        </View>
      )}
    </View>
  );
}

/**
 * Form Input Field matching Magic Patterns
 */
export function CarryField({
  label,
  value,
  onChangeText,
  placeholder,
  password = false,
  error,
  hint,
  prefix,
  icon,
  keyboardType = "default",
  autoCapitalize = "none",
  multiline = false,
}: {
  label: string;
  value?: string;
  onChangeText?: (text: string) => void;
  placeholder?: string;
  password?: boolean;
  error?: string;
  hint?: string;
  prefix?: string;
  icon?: React.ReactNode;
  keyboardType?: "default" | "email-address" | "phone-pad" | "number-pad";
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  multiline?: boolean;
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.fieldContainer}>
      <Text style={styles.fieldLabel}>{label}</Text>

      <View
        style={[
          styles.fieldInputWrapper,
          multiline && { height: 90, alignItems: "flex-start", paddingTop: 12 },
          {
            borderColor: error
              ? colors.error
              : isFocused
              ? colors.ink
              : colors.line,
            borderWidth: error || isFocused ? 1.5 : 1,
          },
        ]}
      >
        {icon && <View style={styles.fieldLeadingIcon}>{icon}</View>}
        {prefix && <Text style={styles.fieldPrefix}>{prefix}</Text>}

        <TextInput
          style={[styles.fieldInput, multiline && { textAlignVertical: "top" }]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.disabled}
          secureTextEntry={password && !showPassword}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          multiline={multiline}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />

        {password && (
          <Pressable
            onPress={() => setShowPassword((s) => !s)}
            style={styles.fieldEyeButton}
          >
            {showPassword ? (
              <EyeOff size={20} color={colors.muted} />
            ) : (
              <Eye size={20} color={colors.muted} />
            )}
          </Pressable>
        )}
      </View>

      {error ? (
        <View style={styles.fieldErrorRow}>
          <AlertCircle size={14} color={colors.error} strokeWidth={2.5} />
          <Text style={styles.fieldErrorText}>{error}</Text>
        </View>
      ) : hint ? (
        <Text style={styles.fieldHint}>{hint}</Text>
      ) : null}
    </View>
  );
}

/**
 * Square Checkbox with label
 */
export function CarryCheck({
  checked,
  onPress,
  label,
}: {
  checked: boolean;
  onPress: () => void;
  label: React.ReactNode;
}) {
  return (
    <Pressable onPress={onPress} style={styles.checkRow}>
      <View
        style={[
          styles.checkBox,
          {
            backgroundColor: checked ? colors.ink : colors.card,
            borderColor: checked ? colors.ink : colors.disabled,
          },
        ]}
      >
        {checked && <Text style={styles.checkMark}>✓</Text>}
      </View>
      <View style={styles.checkLabelWrapper}>
        {typeof label === "string" ? (
          <Text style={styles.checkLabelText}>{label}</Text>
        ) : (
          label
        )}
      </View>
    </Pressable>
  );
}

/**
 * Clean White Surface Card
 */
export function CarryCard({
  children,
  style,
  onPress,
}: {
  children: React.ReactNode;
  style?: object;
  onPress?: () => void;
}) {
  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          styles.card,
          style,
          pressed && { opacity: 0.94 },
        ]}
      >
        {children}
      </Pressable>
    );
  }
  return <View style={[styles.card, style]}>{children}</View>;
}

/**
 * Choice Filter Chips
 */
export function CarryChip({
  label,
  active = false,
  onPress,
  icon,
}: {
  label: string;
  active?: boolean;
  onPress: () => void;
  icon?: React.ReactNode;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.chip,
        {
          backgroundColor: active ? colors.ink : colors.card,
          borderColor: active ? colors.ink : colors.line,
        },
      ]}
    >
      {icon && <View style={{ marginRight: 6 }}>{icon}</View>}
      <Text
        style={[
          styles.chipText,
          { color: active ? "#FFFFFF" : colors.text },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

/**
 * Status Tag / Badge
 */
export function CarryStatusTag({
  tone = "outline",
  children,
}: {
  tone?: "solid" | "outline" | "muted";
  children: React.ReactNode;
}) {
  let bg: string = colors.card;
  let textColor: string = colors.text;
  let borderColor: string = colors.ink;

  if (tone === "solid") {
    bg = colors.ink;
    textColor = "#FFFFFF";
    borderColor = colors.ink;
  } else if (tone === "muted") {
    bg = colors.mist;
    textColor = colors.muted;
    borderColor = colors.mist;
  }

  return (
    <View style={[styles.statusTag, { backgroundColor: bg, borderColor }]}>
      <Text style={[styles.statusTagText, { color: textColor }]}>
        {children}
      </Text>
    </View>
  );
}

/**
 * Sticky Bottom Action Bar
 */
export function CarryActionBar({ children }: { children: React.ReactNode }) {
  return <View style={styles.actionBar}>{children}</View>;
}

const styles = StyleSheet.create({
  buttonBase: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    fontWeight: "700",
    letterSpacing: -0.2,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  topBar: {
    backgroundColor: colors.paper,
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
  },
  topBarRow: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 44,
  },
  topBarCenter: {
    flex: 1,
    paddingHorizontal: 8,
  },
  topBarTitle: {
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: -0.2,
  },
  topBarSubtitle: {
    fontSize: 13,
    color: colors.muted,
  },
  topBarRight: {
    minWidth: 44,
    alignItems: "flex-end",
  },
  largeHeadingWrapper: {
    paddingTop: 12,
    paddingBottom: 4,
    paddingHorizontal: 4,
  },
  largeHeading: {
    fontSize: 30,
    fontWeight: "900",
    letterSpacing: -0.8,
  },
  fieldContainer: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 8,
  },
  fieldInputWrapper: {
    height: 54,
    borderRadius: 14,
    backgroundColor: colors.card,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
  },
  fieldLeadingIcon: {
    marginRight: 10,
  },
  fieldPrefix: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.text,
    marginRight: 8,
  },
  fieldInput: {
    flex: 1,
    fontSize: 15,
    color: colors.text,
    height: "100%",
  },
  fieldEyeButton: {
    padding: 6,
  },
  fieldErrorRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
    gap: 6,
  },
  fieldErrorText: {
    fontSize: 13,
    fontWeight: "500",
    color: colors.error,
  },
  fieldHint: {
    fontSize: 13,
    color: colors.muted,
    marginTop: 6,
  },
  checkRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    minHeight: 44,
    paddingVertical: 6,
  },
  checkBox: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
    marginRight: 12,
  },
  checkMark: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "900",
    lineHeight: 14,
  },
  checkLabelWrapper: {
    flex: 1,
  },
  checkLabelText: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 16,
  },
  chip: {
    height: 40,
    paddingHorizontal: 16,
    borderRadius: 99,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  chipText: {
    fontSize: 13,
    fontWeight: "600",
  },
  statusTag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 99,
    borderWidth: 1,
    alignSelf: "flex-start",
  },
  statusTagText: {
    fontSize: 11,
    fontWeight: "700",
  },
  actionBar: {
    borderTopWidth: 1,
    borderTopColor: colors.line,
    backgroundColor: colors.card,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 20,
  },
});
