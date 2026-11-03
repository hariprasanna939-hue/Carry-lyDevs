import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CarryMapPreview } from "../components/CarryMapPreview";
import { CarryButton } from "../components/CarryUI";
import { CarryVehicleArt } from "../components/CarryVehicleArt";
import { colors } from "../theme/colors";

type Props = {
  onFinish: () => void;
  onSkip: () => void;
};

const slides = [
  {
    title: "The right vehicle for every load.",
    body: "From a single carton to a 3 BHK home — pick Mini, Small, Medium or Large and see the fare before you book.",
    type: "vehicles",
  },
  {
    title: "Instant, or on your schedule.",
    body: "Get a driver in minutes, or lock in a date and time for your move. Your pickup and drop, saved for next time.",
    type: "schedule",
  },
  {
    title: "Helpers, floors, lifts — handled.",
    body: "Add up to two loading helpers and tell us about stairs. Follow every step from pickup to drop.",
    type: "helpers",
  },
];

/**
 * Customer Onboarding 3-Slide Carousel in Pure Monochrome
 * Matching Magic Patterns design (Frame ID: eCBVGmD5wiHxzyHxhyUz9C)
 */
export default function CustomerOnboardingScreen({ onFinish, onSkip }: Props) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const isLast = currentSlide === slides.length - 1;

  const handleNext = () => {
    if (isLast) {
      onFinish();
    } else {
      setCurrentSlide((s) => s + 1);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header with counter and Skip button */}
        <View style={styles.header}>
          <Text style={styles.counter}>
            {currentSlide + 1}/{slides.length}
          </Text>
          <Pressable onPress={onSkip} style={styles.skipButton}>
            <Text style={styles.skipText}>Skip</Text>
          </Pressable>
        </View>

        {/* Visual Illustration Area */}
        <View style={styles.artworkArea}>
          {currentSlide === 0 && (
            <View style={styles.vehiclesShowcase}>
              <View style={styles.vehicleRow}>
                <CarryVehicleArt type="large" width={140} />
              </View>
              <View style={[styles.vehicleRow, { marginTop: 12 }]}>
                <CarryVehicleArt type="mini" width={110} />
              </View>
            </View>
          )}

          {currentSlide === 1 && (
            <View style={styles.mapShowcase}>
              <CarryMapPreview height={180} showRoute />
            </View>
          )}

          {currentSlide === 2 && (
            <View style={styles.helpersShowcase}>
              <View style={styles.helperCard}>
                <Text style={styles.helperTitle}>Loading & Unloading Helpers</Text>
                <Text style={styles.helperDesc}>
                  Trained partners in Coimbatore to carry your goods safely up and down stairs.
                </Text>
                <View style={styles.helperBadgesRow}>
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>Driver Only</Text>
                  </View>
                  <View style={[styles.badge, styles.badgeActive]}>
                    <Text style={styles.badgeTextActive}>+1 Helper</Text>
                  </View>
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>+2 Helpers</Text>
                  </View>
                </View>
              </View>
            </View>
          )}
        </View>

        {/* Text Details Area */}
        <View style={styles.textDetails}>
          <Text style={styles.title}>{slides[currentSlide].title}</Text>
          <Text style={styles.body}>{slides[currentSlide].body}</Text>
        </View>

        {/* Footer with Step Dots and Continue Button */}
        <View style={styles.footer}>
          <View style={styles.dotsRow}>
            {slides.map((_, i) => (
              <View
                key={i}
                style={[
                  styles.dot,
                  {
                    width: i === currentSlide ? 24 : 8,
                    backgroundColor:
                      i === currentSlide
                        ? colors.primaryBlack
                        : colors.disabledGrey,
                  },
                ]}
              />
            ))}
          </View>

          <View style={styles.continueButtonWrapper}>
            <CarryButton onPress={handleNext} variant="primary">
              {isLast ? "Get started" : "Continue"}
            </CarryButton>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "space-between",
    paddingBottom: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 12,
    height: 48,
  },
  counter: {
    fontSize: 14,
    fontFamily: "monospace",
    fontWeight: "700",
    color: colors.secondaryText,
  },
  skipButton: {
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  skipText: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.mainText,
  },
  artworkArea: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 12,
  },
  vehiclesShowcase: {
    alignItems: "center",
  },
  vehicleRow: {
    alignItems: "center",
  },
  mapShowcase: {
    width: "100%",
  },
  helpersShowcase: {
    width: "100%",
  },
  helperCard: {
    backgroundColor: colors.cardSurface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.borderGrey,
    padding: 20,
  },
  helperTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: colors.primaryBlack,
    letterSpacing: -0.3,
  },
  helperDesc: {
    fontSize: 14,
    color: colors.secondaryText,
    lineHeight: 20,
    marginTop: 6,
  },
  helperBadgesRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 16,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 99,
    backgroundColor: colors.lightGrey,
    borderWidth: 1,
    borderColor: colors.borderGrey,
  },
  badgeActive: {
    backgroundColor: colors.primaryBlack,
    borderColor: colors.primaryBlack,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.secondaryText,
  },
  badgeTextActive: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.white,
  },
  textDetails: {
    minHeight: 140,
    justifyContent: "flex-end",
    marginBottom: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: "900",
    color: colors.primaryBlack,
    letterSpacing: -0.8,
    lineHeight: 36,
  },
  body: {
    marginTop: 10,
    fontSize: 15,
    lineHeight: 22,
    color: colors.secondaryText,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
  },
  dotsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  continueButtonWrapper: {
    flex: 1,
    maxWidth: 180,
  },
});
