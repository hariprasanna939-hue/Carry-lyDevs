import React, { useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Check, Users } from "lucide-react-native";
import { OnboardingButton } from "../components/onboarding/OnboardingButton";
import {
  OnboardingDots,
  OnboardingHeader,
} from "../components/onboarding/OnboardingProgress";
import { CarryVehicleArt, VehicleArtType } from "../components/CarryVehicleArt";
import {
  ONBOARDING_SLIDES,
  ONBOARDING_VEHICLES,
} from "../features/onboarding/onboardingData";
import { completeOnboarding } from "../features/onboarding/onboardingStorage";
import { colors } from "../theme/colors";

interface Props {
  onFinish: () => void;
  onSkip: () => void;
  onBackToWelcome?: () => void;
  initialSlide?: number;
}

/**
 * Customer Onboarding 3-Slide Flow in Pure Monochrome
 * Matching Magic Patterns design (Frame ID: eCBVGmD5wiHxzyHxhyUz9C)
 */
export default function CustomerOnboardingScreen({
  onFinish,
  onSkip,
  onBackToWelcome,
  initialSlide = 0,
}: Props) {
  const [currentSlide, setCurrentSlide] = useState(initialSlide);
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleArtType>("small");
  const [helperCount, setHelperCount] = useState<1 | 2>(2);

  const isLast = currentSlide === ONBOARDING_SLIDES.length - 1;
  const slide = ONBOARDING_SLIDES[currentSlide];

  const handleNext = async () => {
    if (isLast) {
      await completeOnboarding();
      onFinish();
    } else {
      setCurrentSlide((s) => s + 1);
    }
  };

  const handleBack = () => {
    if (currentSlide > 0) {
      setCurrentSlide((s) => s - 1);
    } else if (onBackToWelcome) {
      onBackToWelcome();
    }
  };

  const handleSkip = async () => {
    await completeOnboarding();
    onSkip();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />

      {/* Top Header with Progress and Skip */}
      <OnboardingHeader
        currentSlide={currentSlide}
        totalSlides={ONBOARDING_SLIDES.length}
        onBack={currentSlide > 0 || onBackToWelcome ? handleBack : undefined}
        onSkip={handleSkip}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ========================================================= */}
        {/* SLIDE 1 ARTWORK: 4 VERTICALLY STACKED VEHICLE CARDS       */}
        {/* ========================================================= */}
        {currentSlide === 0 && (
          <View style={styles.artworkContainer}>
            <View style={styles.vehicleList}>
              {ONBOARDING_VEHICLES.map((v) => {
                const isSelected = selectedVehicle === v.id;
                return (
                  <Pressable
                    key={v.id}
                    onPress={() => setSelectedVehicle(v.id)}
                    style={[
                      styles.vehicleCard,
                      isSelected
                        ? styles.vehicleCardSelected
                        : styles.vehicleCardDefault,
                    ]}
                    accessibilityRole="radio"
                    accessibilityState={{ selected: isSelected }}
                    accessibilityLabel={`${v.name} vehicle, capacity ${v.capacity}`}
                  >
                    <View style={styles.vehicleLabelCol}>
                      <Text style={styles.vehicleName}>{v.name}</Text>
                      <Text style={styles.vehicleCapacity}>{v.capacity}</Text>
                    </View>
                    <View style={styles.vehicleArtWrapper}>
                      <CarryVehicleArt
                        type={v.id}
                        width={v.id === "large" ? 112 : v.id === "medium" ? 98 : 88}
                      />
                    </View>
                  </Pressable>
                );
              })}
            </View>
          </View>
        )}

        {/* ========================================================= */}
        {/* SLIDE 2 ARTWORK: HELPERS & MOVING SUPPORT                 */}
        {/* ========================================================= */}
        {currentSlide === 1 && (
          <View style={styles.artworkContainer}>
            <View style={styles.helpersContainer}>
              {/* Interactive Helper Option Card */}
              <Pressable
                onPress={() => setHelperCount((h) => (h === 1 ? 2 : 1))}
                style={styles.helperCard}
                accessibilityRole="button"
                accessibilityLabel={`${helperCount} helpers selected. Tap to change.`}
              >
                <View style={styles.helperIconCircle}>
                  <Users size={22} color="#FFFFFF" />
                </View>

                <View style={styles.helperTextCol}>
                  <Text style={styles.helperCountText}>
                    {helperCount} helper{helperCount > 1 ? "s" : ""}
                  </Text>
                  <Text style={styles.helperSubText}>Loading and unloading</Text>
                </View>

                <View style={styles.checkCircle}>
                  <Check size={14} color="#FFFFFF" strokeWidth={3} />
                </View>
              </Pressable>

              {/* Floor and Lift Information Cards */}
              <View style={styles.floorGrid}>
                <View style={styles.floorCard}>
                  <Text style={styles.floorLabel}>Pickup</Text>
                  <Text style={styles.floorValue}>3rd floor</Text>
                  <Text style={styles.floorSub}>Lift available</Text>
                </View>

                <View style={styles.floorCard}>
                  <Text style={styles.floorLabel}>Drop</Text>
                  <Text style={styles.floorValue}>Ground floor</Text>
                  <Text style={styles.floorSub}>No stairs</Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* ========================================================= */}
        {/* SLIDE 3 ARTWORK: GET STARTED & LIVE PROGRESSION           */}
        {/* ========================================================= */}
        {currentSlide === 2 && (
          <View style={styles.artworkContainer}>
            <View style={styles.helpersContainer}>
              {/* Confirmed 2 Helpers Card */}
              <View style={styles.helperCard}>
                <View style={styles.helperIconCircle}>
                  <Users size={22} color="#FFFFFF" />
                </View>

                <View style={styles.helperTextCol}>
                  <Text style={styles.helperCountText}>2 helpers</Text>
                  <Text style={styles.helperSubText}>Loading and unloading</Text>
                </View>

                <View style={styles.checkCircle}>
                  <Check size={14} color="#FFFFFF" strokeWidth={3} />
                </View>
              </View>

              {/* Summary Floor Cards */}
              <View style={styles.floorGrid}>
                <View style={styles.floorCard}>
                  <Text style={styles.floorLabel}>Pickup</Text>
                  <Text style={styles.floorValue}>3rd floor</Text>
                  <Text style={styles.floorSub}>Lift available</Text>
                </View>

                <View style={styles.floorCard}>
                  <Text style={styles.floorLabel}>Drop</Text>
                  <Text style={styles.floorValue}>Ground floor</Text>
                  <Text style={styles.floorSub}>Direct entry</Text>
                </View>
              </View>

              {/* Step Tracking Callout */}
              <View style={styles.trackingPillCard}>
                <View style={styles.trackingDot} />
                <Text style={styles.trackingPillText}>
                  Live move updates from pickup to drop
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Text Content Area */}
        <View style={styles.textContent}>
          {currentSlide === 2 && (
            <Text style={styles.badgeLabel}>Moving Made Easy</Text>
          )}
          <Text style={styles.headline}>{slide.title}</Text>
          <Text style={styles.description}>{slide.description}</Text>
        </View>
      </ScrollView>

      {/* Footer Navigation Bar */}
      <View style={styles.footer}>
        <OnboardingDots
          currentSlide={currentSlide}
          totalSlides={ONBOARDING_SLIDES.length}
        />

        <View style={styles.buttonWrapper}>
          <OnboardingButton
            label={isLast ? "Get started" : "Next"}
            onPress={handleNext}
          />
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 20,
    justifyContent: "space-between",
    minHeight: 460,
  },
  artworkContainer: {
    paddingVertical: 12,
  },
  vehicleList: {
    gap: 10,
  },
  vehicleCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 18,
    backgroundColor: colors.white,
  },
  vehicleCardDefault: {
    borderWidth: 1,
    borderColor: colors.borderGrey,
  },
  vehicleCardSelected: {
    borderWidth: 2,
    borderColor: colors.primaryBlack,
  },
  vehicleLabelCol: {
    justifyContent: "center",
  },
  vehicleName: {
    fontSize: 15,
    fontWeight: "800",
    color: colors.primaryBlack,
  },
  vehicleCapacity: {
    fontSize: 12,
    fontWeight: "500",
    color: colors.secondaryText,
    marginTop: 2,
  },
  vehicleArtWrapper: {
    alignItems: "center",
    justifyContent: "center",
  },
  helpersContainer: {
    gap: 12,
  },
  helperCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    backgroundColor: colors.white,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: colors.primaryBlack,
    padding: 16,
  },
  helperIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: colors.primaryBlack,
    alignItems: "center",
    justifyContent: "center",
  },
  helperTextCol: {
    flex: 1,
  },
  helperCountText: {
    fontSize: 16,
    fontWeight: "800",
    color: colors.primaryBlack,
  },
  helperSubText: {
    fontSize: 13,
    color: colors.secondaryText,
    marginTop: 2,
  },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primaryBlack,
    alignItems: "center",
    justifyContent: "center",
  },
  floorGrid: {
    flexDirection: "row",
    gap: 12,
  },
  floorCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.borderGrey,
    padding: 16,
  },
  floorLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.secondaryText,
  },
  floorValue: {
    fontSize: 15,
    fontWeight: "800",
    color: colors.primaryBlack,
    marginTop: 4,
  },
  floorSub: {
    fontSize: 13,
    color: colors.secondaryText,
    marginTop: 2,
  },
  trackingPillCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.borderGrey,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  trackingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primaryBlack,
  },
  trackingPillText: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.primaryBlack,
  },
  textContent: {
    marginTop: 24,
    marginBottom: 8,
  },
  badgeLabel: {
    fontSize: 12,
    fontWeight: "800",
    color: colors.secondaryText,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 6,
  },
  headline: {
    fontSize: 30,
    fontWeight: "900",
    color: colors.primaryBlack,
    letterSpacing: -0.8,
    lineHeight: 36,
  },
  description: {
    fontSize: 15,
    color: colors.secondaryText,
    lineHeight: 22,
    marginTop: 10,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 24,
    backgroundColor: colors.cardSurface,
    borderTopWidth: 1,
    borderTopColor: colors.borderGrey,
  },
  buttonWrapper: {
    minWidth: 148,
  },
});
