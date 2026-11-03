import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { colors } from "../../../src/theme/colors";
import Button from "../../../src/components/ui/Button";
import { useAuth } from "../../../src/hooks/useAuth";
import { driverOnboardingService } from "../../../src/services/driver-onboarding.service";
import { DriverApplicationRecord } from "../../../src/types/driver-onboarding";

export default function DriverRegistrationWelcomeScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [existingApp, setExistingApp] = useState<DriverApplicationRecord | null>(null);

  useEffect(() => {
    async function loadApp() {
      if (user?.uid) {
        try {
          const app = await driverOnboardingService.getDriverApplication(user.uid);
          setExistingApp(app);
        } catch (e) {
          console.log("Error loading app:", e);
        }
      }
      setLoading(false);
    }
    loadApp();
  }, [user]);

  const hasDraft = existingApp && existingApp.currentStep > 1 && existingApp.status === "DRAFT";
  const isSubmittedOrReview = existingApp && existingApp.status !== "DRAFT" && existingApp.status !== "INCOMPLETE";

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Brand Header */}
        <View style={styles.header}>
          <Text style={styles.brand}>CARRY</Text>
          <View style={styles.badgeCity}>
            <Text style={styles.badgeCityText}>📍 Coimbatore, Tamil Nadu</Text>
          </View>
        </View>

        {/* Hero Card */}
        <View style={styles.heroCard}>
          <Text style={styles.heroEmoji}>🚚</Text>
          <Text style={styles.heroTitle}>Become a CARRY Driver Partner</Text>
          <Text style={styles.heroSubtitle}>
            Earn by helping people and businesses move goods, machinery, and household belongings across Coimbatore.
          </Text>
        </View>

        {/* Status / Resume Notice if applicable */}
        {isSubmittedOrReview ? (
          <View style={styles.noticeCard}>
            <Text style={styles.noticeTitle}>📋 Application on Record</Text>
            <Text style={styles.noticeDesc}>
              Status: <Text style={{ fontWeight: "800" }}>{existingApp.status}</Text>
              {"\n"}Ref: {existingApp.referenceNumber}
            </Text>
            <Button
              title="Track Application Status"
              size="medium"
              onPress={() => router.push("/(driver)/registration/status")}
              style={{ marginTop: 10 }}
            />
          </View>
        ) : hasDraft ? (
          <View style={styles.resumeCard}>
            <Text style={styles.resumeTitle}>⏱️ Unfinished Application Found</Text>
            <Text style={styles.resumeDesc}>
              You have completed Step {existingApp.currentStep - 1} of 12. Your progress is saved.
            </Text>
            <Button
              title={`Continue Step ${existingApp.currentStep}`}
              size="medium"
              onPress={() => router.push("/(driver)/registration/onboarding")}
              style={{ marginTop: 10 }}
            />
          </View>
        ) : null}

        {/* Operational Highlights */}
        <Text style={styles.sectionHeader}>Why Drive with CARRY?</Text>
        
        <View style={styles.benefitsGrid}>
          <View style={styles.benefitItem}>
            <Text style={styles.benefitIcon}>⏱️</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.benefitTitle}>Flexible Working Hours</Text>
              <Text style={styles.benefitDesc}>
                Work full-time, part-time, or during peak hours. You decide when to go online.
              </Text>
            </View>
          </View>

          <View style={styles.benefitItem}>
            <Text style={styles.benefitIcon}>📈</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.benefitTitle}>Direct Booking Opportunities</Text>
              <Text style={styles.benefitDesc}>
                Connect directly with commercial textile traders, engineering units & residential movers.
              </Text>
            </View>
          </View>

          <View style={styles.benefitItem}>
            <Text style={styles.benefitIcon}>💳</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.benefitTitle}>Transparent Payouts</Text>
              <Text style={styles.benefitDesc}>
                Clear per-km rates, helper fee breakdown, and reliable bank payouts.
              </Text>
            </View>
          </View>

          <View style={styles.benefitItem}>
            <Text style={styles.benefitIcon}>🛺</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.benefitTitle}>Multiple Vehicle Support</Text>
              <Text style={styles.benefitDesc}>
                Register 3-Wheelers, Tata Ace, Bolero Pickups, or Mini Vans under one account.
              </Text>
            </View>
          </View>
        </View>

        {/* Transparency note */}
        <View style={styles.disclaimerBox}>
          <Text style={styles.disclaimerText}>
            ℹ️ Earnings depend on trip distance, vehicle type, and operational hours. CARRY does not promise guaranteed earnings or guaranteed bookings.
          </Text>
        </View>

        {/* Action Button */}
        {!isSubmittedOrReview && (
          <Button
            title={hasDraft ? "Continue Registration" : "Get Started (12 Steps)"}
            size="large"
            onPress={() => router.push("/(driver)/registration/onboarding")}
            style={{ marginTop: 16 }}
          />
        )}

        {/* Footer links */}
        <View style={styles.footerRow}>
          <Text style={styles.footerText}>Already registered? </Text>
          <TouchableOpacity onPress={() => router.push("/(driver)/registration/status")}>
            <Text style={styles.footerLink}>Check Status</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  brand: {
    fontSize: 28,
    fontWeight: "900",
    color: colors.primary,
    letterSpacing: 1.5,
  },
  badgeCity: {
    backgroundColor: "#E2E8F0",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeCityText: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.deepNavy,
  },
  heroCard: {
    backgroundColor: colors.surface,
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    marginBottom: 16,
  },
  heroEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: colors.deepNavy,
    textAlign: "center",
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 14,
    color: colors.secondaryText,
    textAlign: "center",
    lineHeight: 20,
  },
  noticeCard: {
    backgroundColor: "#F0FDF4",
    borderWidth: 1,
    borderColor: "#86EFAC",
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
  },
  noticeTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#166534",
    marginBottom: 4,
  },
  noticeDesc: {
    fontSize: 13,
    color: "#15803D",
    lineHeight: 18,
  },
  resumeCard: {
    backgroundColor: "#FEF3C7",
    borderWidth: 1,
    borderColor: "#FCD34D",
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
  },
  resumeTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#92400E",
    marginBottom: 4,
  },
  resumeDesc: {
    fontSize: 13,
    color: "#78350F",
    lineHeight: 18,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.deepNavy,
    marginVertical: 14,
  },
  benefitsGrid: {
    gap: 12,
    marginBottom: 16,
  },
  benefitItem: {
    flexDirection: "row",
    backgroundColor: colors.surface,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    gap: 14,
  },
  benefitIcon: {
    fontSize: 28,
  },
  benefitTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.deepNavy,
    marginBottom: 2,
  },
  benefitDesc: {
    fontSize: 12,
    color: colors.secondaryText,
    lineHeight: 17,
  },
  disclaimerBox: {
    backgroundColor: "#F8FAFC",
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 10,
  },
  disclaimerText: {
    fontSize: 11,
    color: "#64748B",
    lineHeight: 16,
    textAlign: "center",
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  footerText: {
    fontSize: 14,
    color: colors.secondaryText,
  },
  footerLink: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.primary,
  },
});
