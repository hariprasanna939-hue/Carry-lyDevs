import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors } from "../../theme/colors";

interface Props {
  currentStep: number;
  totalSteps?: number;
  stepTitle: string;
  onBack?: () => void;
  canGoBack?: boolean;
}

export default function OnboardingProgressBar({
  currentStep,
  totalSteps = 12,
  stepTitle,
  onBack,
  canGoBack = true,
}: Props) {
  const progressPercent = Math.min(100, Math.round((currentStep / totalSteps) * 100));

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        {canGoBack && onBack ? (
          <TouchableOpacity onPress={onBack} style={styles.backBtn} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.backBtnPlaceholder} />
        )}
        <Text style={styles.stepCounter}>
          Step {currentStep} of {totalSteps}
        </Text>
        <Text style={styles.percentText}>{progressPercent}%</Text>
      </View>

      {/* Progress Track */}
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${progressPercent}%` }]} />
      </View>

      <Text style={styles.title}>{stepTitle}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  backBtn: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    backgroundColor: "#F1F5F9",
  },
  backText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: "700",
  },
  backBtnPlaceholder: {
    width: 60,
  },
  stepCounter: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.secondaryText,
    letterSpacing: 0.3,
  },
  percentText: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.primary,
    width: 60,
    textAlign: "right",
  },
  track: {
    height: 6,
    backgroundColor: "#E2E8F0",
    borderRadius: 3,
    overflow: "hidden",
    marginBottom: 10,
  },
  fill: {
    height: "100%",
    backgroundColor: colors.primary,
    borderRadius: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.deepNavy,
  },
});
