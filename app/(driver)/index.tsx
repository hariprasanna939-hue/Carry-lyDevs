import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { colors } from "../../src/theme/colors";
import Button from "../../src/components/ui/Button";
import { useAuth } from "../../src/hooks/useAuth";
import { auth } from "../../src/firebase/firebase";
import { driverOnboardingService } from "../../src/services/driver-onboarding.service";
import { DriverApplicationRecord } from "../../src/types/driver-onboarding";

export default function DriverDashboardScreen() {
  const router = useRouter();
  const { user, firebaseUser } = useAuth();
  const uid = auth.currentUser?.uid || firebaseUser?.uid || user?.uid || "";

  const [isOnline, setIsOnline] = useState(false);
  const [appRecord, setAppRecord] = useState<DriverApplicationRecord | null>(null);

  const isApproved = user?.driverVerificationStatus === "approved";

  useEffect(() => {
    async function load() {
      try {
        const app = await driverOnboardingService.getDriverApplication(uid);
        setAppRecord(app);
      } catch (e) {
        console.log("Error loading driver app:", e);
      }
    }
    load();
  }, [uid]);

  // If driver is not approved yet, display the Onboarding Status screen
  if (!isApproved) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scroll}>
          <View style={styles.header}>
            <View>
              <Text style={styles.greeting}>Partner Onboarding</Text>
              <Text style={styles.driverName}>{user?.fullName || "Driver Partner"}</Text>
            </View>
            <TouchableOpacity
              style={styles.profileBtn}
              onPress={() => router.push("/(driver)/profile")}
            >
              <Text style={{ fontSize: 18 }}>👤</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.pendingCard}>
            <Text style={styles.pendingIcon}>⏳</Text>
            <Text style={styles.pendingTitle}>Verification in Progress</Text>
            <Text style={styles.pendingDesc}>
              Your CARRY Driver Partner application is currently under verification.
              Live trip requests and online availability will unlock as soon as your KYC and vehicle documents are approved.
            </Text>

            <View style={styles.refBox}>
              <Text style={styles.refLabel}>APPLICATION REFERENCE</Text>
              <Text style={styles.refValue}>
                {appRecord?.referenceNumber || "CARRY-DRV-2026-PENDING"}
              </Text>
              <Text style={[styles.refLabel, { marginTop: 8 }]}>APPLICATION STATUS</Text>
              <Text style={styles.refStatus}>
                {appRecord?.status ? appRecord.status.replace("_", " ") : "UNDER REVIEW"}
              </Text>
            </View>

            <Button
              title="View Onboarding Status Hub"
              size="large"
              onPress={() => router.push("/(driver)/registration/status")}
              style={{ width: "100%", marginTop: 16 }}
            />

            <Button
              title="Continue / Edit Application"
              variant="outline"
              size="medium"
              onPress={() => router.push("/(driver)/registration/onboarding")}
              style={{ width: "100%", marginTop: 10 }}
            />
          </View>

          <View style={styles.helpBox}>
            <Text style={styles.helpTitle}>Need help with verification?</Text>
            <Text style={styles.helpText}>
              Visit our Coimbatore Partner Desk at Gandhipuram or call driver support at +91 422 234 5678.
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  const activeVehicle = appRecord?.vehicles?.[0];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Approved Driver Header */}
        <View style={styles.header}>
          <View>
            <View style={styles.verifiedRow}>
              <Text style={styles.verifiedPill}>✓ VERIFIED PARTNER</Text>
            </View>
            <Text style={styles.greeting}>Welcome back,</Text>
            <Text style={styles.driverName}>{user?.fullName || "Driver Partner"}</Text>
          </View>
          <TouchableOpacity
            style={styles.profileBtn}
            onPress={() => router.push("/(driver)/profile")}
          >
            <Text style={{ fontSize: 20 }}>🚚</Text>
          </TouchableOpacity>
        </View>

        {/* Online / Offline Switch */}
        <View style={[styles.statusCard, isOnline ? styles.onlineCard : styles.offlineCard]}>
          <View style={styles.statusInfo}>
            <View
              style={[
                styles.statusDot,
                { backgroundColor: isOnline ? colors.success : colors.secondaryText },
              ]}
            />
            <View>
              <Text style={styles.statusTitle}>
                {isOnline ? "You are Online" : "You are Offline"}
              </Text>
              <Text style={styles.statusSubtitle}>
                {isOnline
                  ? "Receiving trip alerts across Coimbatore"
                  : "Turn switch on to start receiving goods bookings"}
              </Text>
            </View>
          </View>
          <Switch
            value={isOnline}
            onValueChange={setIsOnline}
            trackColor={{ false: colors.border, true: "#A7F3D0" }}
            thumbColor={isOnline ? colors.success : "#FFFFFF"}
          />
        </View>

        {/* Active Approved Vehicle Card */}
        {activeVehicle && (
          <View style={styles.vehicleCard}>
            <View style={styles.vehicleHeader}>
              <Text style={styles.vehicleTitle}>Active Vehicle</Text>
              <Text style={styles.vehicleStatusBadge}>
                {activeVehicle.approvalStatus === "verified" ? "APPROVED" : "PENDING"}
              </Text>
            </View>
            <Text style={styles.vehicleRegText}>{activeVehicle.registrationNumber}</Text>
            <Text style={styles.vehicleDetailsText}>
              {activeVehicle.categoryDisplayName} · {activeVehicle.make} {activeVehicle.model} ({activeVehicle.year})
            </Text>
            <Text style={styles.vehiclePayload}>
              ⚖️ Max Payload: {activeVehicle.payloadCapacityKg} kg · Base: Coimbatore
            </Text>
          </View>
        )}

        {/* Daily Stats Overview */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Today's Earnings</Text>
            <Text style={styles.statValue}>—</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Trips Done</Text>
            <Text style={styles.statValue}>—</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Rating</Text>
            <Text style={styles.statValue}>5.0 ★</Text>
          </View>
        </View>

        {/* Available Jobs CTA */}
        <View style={styles.actionCard}>
          <Text style={styles.actionTitle}>Trip Dispatcher (Coimbatore)</Text>
          <Text style={styles.actionSubtitle}>
            Browse commercial textile, engineering and residential goods bookings in Gandhipuram, Peelamedu & SIDCO.
          </Text>
          <Button
            title="Browse Available Jobs →"
            size="large"
            onPress={() => router.push("/(driver)/jobs")}
            style={{ marginTop: 12 }}
          />
        </View>

        {/* Menu Shortcuts */}
        <View style={styles.grid}>
          <TouchableOpacity
            style={styles.gridCard}
            onPress={() => router.push("/(driver)/registration/status")}
          >
            <Text style={styles.gridIcon}>📑</Text>
            <Text style={styles.gridTitle}>KYC & Status</Text>
            <Text style={styles.gridSubtitle}>Documents & Vehicles</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.gridCard}
            onPress={() => router.push("/(driver)/earnings")}
          >
            <Text style={styles.gridIcon}>💰</Text>
            <Text style={styles.gridTitle}>Earnings</Text>
            <Text style={styles.gridSubtitle}>Bank payouts</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.gridCard}
            onPress={() => router.push("/(driver)/trip-history")}
          >
            <Text style={styles.gridIcon}>📜</Text>
            <Text style={styles.gridTitle}>Trip History</Text>
            <Text style={styles.gridSubtitle}>Past completed loads</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.gridCard}
            onPress={() => router.push("/(auth)/choose-portal")}
          >
            <Text style={styles.gridIcon}>🔄</Text>
            <Text style={styles.gridTitle}>Switch Portal</Text>
            <Text style={styles.gridSubtitle}>Go to Customer</Text>
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
  verifiedRow: {
    marginBottom: 4,
  },
  verifiedPill: {
    fontSize: 11,
    fontWeight: "800",
    color: "#166534",
    backgroundColor: "#DCFCE7",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    alignSelf: "flex-start",
  },
  greeting: {
    fontSize: 14,
    color: colors.secondaryText,
    fontWeight: "500",
  },
  driverName: {
    fontSize: 22,
    fontWeight: "800",
    color: colors.deepNavy,
  },
  profileBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  statusCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 16,
  },
  onlineCard: {
    backgroundColor: "#ECFDF5",
    borderColor: "#A7F3D0",
  },
  offlineCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
  },
  statusInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.deepNavy,
  },
  statusSubtitle: {
    fontSize: 12,
    color: colors.secondaryText,
    marginTop: 2,
  },
  vehicleCard: {
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
  },
  vehicleHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  vehicleTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.secondaryText,
  },
  vehicleStatusBadge: {
    fontSize: 10,
    fontWeight: "800",
    color: "#166534",
    backgroundColor: "#DCFCE7",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  vehicleRegText: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.deepNavy,
    marginBottom: 2,
  },
  vehicleDetailsText: {
    fontSize: 13,
    color: colors.secondaryText,
    marginBottom: 4,
  },
  vehiclePayload: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: "600",
  },
  statsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  statBox: {
    flex: 1,
    backgroundColor: colors.surface,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
  },
  statLabel: {
    fontSize: 11,
    color: colors.secondaryText,
    marginBottom: 4,
    textAlign: "center",
  },
  statValue: {
    fontSize: 17,
    fontWeight: "800",
    color: colors.deepNavy,
  },
  actionCard: {
    backgroundColor: colors.surface,
    padding: 18,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.deepNavy,
  },
  actionSubtitle: {
    fontSize: 13,
    color: colors.secondaryText,
    marginTop: 4,
    lineHeight: 18,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  gridCard: {
    width: "48%",
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  gridIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  gridTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.deepNavy,
  },
  gridSubtitle: {
    fontSize: 11,
    color: colors.secondaryText,
    marginTop: 2,
  },
  pendingCard: {
    backgroundColor: colors.surface,
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    marginBottom: 16,
  },
  pendingIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  pendingTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: colors.deepNavy,
    marginBottom: 8,
    textAlign: "center",
  },
  pendingDesc: {
    fontSize: 14,
    color: colors.secondaryText,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 16,
  },
  refBox: {
    backgroundColor: "#F8FAFC",
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    width: "100%",
  },
  refLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.secondaryText,
  },
  refValue: {
    fontSize: 14,
    fontWeight: "800",
    color: colors.deepNavy,
    marginTop: 2,
  },
  refStatus: {
    fontSize: 13,
    fontWeight: "800",
    color: "#D97706",
    marginTop: 2,
  },
  helpBox: {
    backgroundColor: "#F1F5F9",
    padding: 14,
    borderRadius: 12,
  },
  helpTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.deepNavy,
    marginBottom: 4,
  },
  helpText: {
    fontSize: 12,
    color: colors.secondaryText,
    lineHeight: 16,
  },
});
