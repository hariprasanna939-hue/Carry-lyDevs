import React, { ReactNode } from "react";
import {
  Pressable,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import { colors } from "../theme/colors";

interface Props {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  variant?: "surface" | "primaryTint" | "driverTint" | "warningTint";
}

export default function CarryCard({
  children,
  style,
  onPress,
  variant = "surface",
}: Props) {
  const variantStyle =
    variant === "primaryTint"
      ? styles.primaryTint
      : variant === "driverTint"
      ? styles.driverTint
      : variant === "warningTint"
      ? styles.warningTint
      : styles.surface;

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          styles.base,
          variantStyle,
          pressed && styles.pressed,
          style,
        ]}
      >
        {children}
      </Pressable>
    );
  }

  return <View style={[styles.base, variantStyle, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 14,
  },
  surface: {
    backgroundColor: colors.surface,
  },
  primaryTint: {
    backgroundColor: colors.customerTint,
    borderColor: "#E0DBFF",
  },
  driverTint: {
    backgroundColor: colors.driverTint,
    borderColor: "#D6E6FF",
  },
  warningTint: {
    backgroundColor: "#FFFBEB",
    borderColor: "#FDE68A",
  },
  pressed: {
    opacity: 0.85,
  },
});
