import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { ChevronLeft } from "lucide-react-native";
import { colors } from "../../theme/colors";

interface OnboardingHeaderProps {
  currentSlide: number;
  totalSlides: number;
  onBack?: () => void;
  onSkip?: () => void;
}

export function OnboardingHeader({
  currentSlide,
  totalSlides,
  onBack,
  onSkip,
}: OnboardingHeaderProps) {
  const canGoBack = currentSlide > 0 && !!onBack;

  return (
    <View style={styles.header}>
      <View style={styles.leftRow}>
        {canGoBack && (
          <Pressable
            onPress={onBack}
            hitSlop={12}
            style={styles.backButton}
            accessibilityLabel="Go back to previous slide"
          >
            <ChevronLeft size={22} color={colors.primaryBlack} />
          </Pressable>
        )}
        <Text style={styles.counterText}>
          {currentSlide + 1}/{totalSlides}
        </Text>
      </View>

      {onSkip && (
        <Pressable
          onPress={onSkip}
          hitSlop={12}
          style={styles.skipButton}
          accessibilityLabel="Skip onboarding"
        >
          <Text style={styles.skipText}>Skip</Text>
        </Pressable>
      )}
    </View>
  );
}

interface OnboardingDotsProps {
  currentSlide: number;
  totalSlides: number;
}

export function OnboardingDots({
  currentSlide,
  totalSlides,
}: OnboardingDotsProps) {
  return (
    <View style={styles.dotsContainer}>
      {Array.from({ length: totalSlides }).map((_, index) => {
        const isActive = index === currentSlide;
        return (
          <View
            key={index}
            style={[
              styles.dot,
              isActive ? styles.dotActive : styles.dotInactive,
            ]}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 12,
    minHeight: 48,
  },
  leftRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.lightGrey,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: -4,
  },
  counterText: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.secondaryText,
    fontVariant: ["tabular-nums"],
  },
  skipButton: {
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  skipText: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.primaryBlack,
  },
  dotsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  dotActive: {
    width: 24,
    backgroundColor: colors.primaryBlack,
  },
  dotInactive: {
    width: 8,
    backgroundColor: colors.borderGrey,
  },
});
