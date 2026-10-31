import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors } from "../theme/colors";

export type BadgeVariant =
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "neutral";

interface Props {
  text: string;
  variant?: BadgeVariant;
}

export default function CarryBadge({ text, variant = "neutral" }: Props) {
  const badgeStyle =
    variant === "success"
      ? styles.successBadge
      : variant === "warning"
      ? styles.warningBadge
      : variant === "danger"
      ? styles.dangerBadge
      : variant === "info"
      ? styles.infoBadge
      : styles.neutralBadge;

  const textStyle =
    variant === "success"
      ? styles.successText
      : variant === "warning"
      ? styles.warningText
      : variant === "danger"
      ? styles.dangerText
      : variant === "info"
      ? styles.infoText
      : styles.neutralText;

  return (
    <View style={[styles.badge, badgeStyle]}>
      <Text style={[styles.text, textStyle]}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  text: {
    fontSize: 12,
    fontWeight: "700",
  },
  successBadge: {
    backgroundColor: "#DCFCE7",
  },
  successText: {
    color: "#15803D",
  },
  warningBadge: {
    backgroundColor: "#FEF3C7",
  },
  warningText: {
    color: "#B45309",
  },
  dangerBadge: {
    backgroundColor: "#FEE2E2",
  },
  dangerText: {
    color: "#B91C1C",
  },
  infoBadge: {
    backgroundColor: "#E0E7FF",
  },
  infoText: {
    color: "#4338CA",
  },
  neutralBadge: {
    backgroundColor: "#F1F5F9",
  },
  neutralText: {
    color: "#475569",
  },
});
