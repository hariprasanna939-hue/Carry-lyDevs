import React from "react";
import { StyleSheet, Text, View, ViewStyle, TextStyle } from "react-native";
import { colors } from "../../theme/colors";

export interface BadgeProps {
  label: string;
  variant?: "primary" | "success" | "warning" | "danger" | "neutral";
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = "primary",
  style,
  textStyle,
}) => {
  const getColors = () => {
    switch (variant) {
      case "success":
        return { bg: "#E6F7F0", text: colors.success };
      case "warning":
        return { bg: "#FEF7E6", text: colors.warning };
      case "danger":
        return { bg: "#FDECEE", text: colors.danger };
      case "neutral":
        return { bg: "#F0F2F7", text: colors.secondaryText };
      default:
        return { bg: colors.customerTint, text: colors.primary };
    }
  };

  const { bg, text } = getColors();

  return (
    <View style={[styles.badge, { backgroundColor: bg }, style]}>
      <Text style={[styles.badgeText, { color: text }, textStyle]}>{label}</Text>
    </View>
  );
};

export default Badge;

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
  },
});
