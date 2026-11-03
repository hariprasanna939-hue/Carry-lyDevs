import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CarryLogo } from "../components/CarryLogo";
import { CarryButton } from "../components/CarryUI";
import { CarryVehicleArt } from "../components/CarryVehicleArt";
import { colors } from "../theme/colors";

type Props = {
  onCreate?: () => void;
  onGetStarted?: () => void;
  onLogin: () => void;
  onSwitchPortal?: () => void;
};

/**
 * Driver Welcome Screen faithfully reproduced from Magic Patterns design
 * Frame ID: vhaEKHsRsFZ1EeTX19EGzG
 */
export default function DriverWelcomeScreen({
  onCreate,
  onGetStarted,
  onLogin,
  onSwitchPortal,
}: Props) {
  const handleCreate = onGetStarted || onCreate || (() => {});
  return (
    <View style={styles.container}>
      {/* Dark Upper Section: Hero */}
      <SafeAreaView style={styles.heroSection}>
        <View style={styles.topBar}>
          <CarryLogo size={26} tone="light" variant="crate" />
          <View style={styles.driverBadge}>
            <Text style={styles.driverBadgeText}>Driver</Text>
          </View>
        </View>

        <View style={styles.heroContent}>
          <Text style={styles.heroHeadline}>
            Your truck.{"\n"}
            Your hours.{"\n"}
            <Text style={styles.heroHeadlineDim}>Your earnings.</Text>
          </Text>

          <Text style={styles.heroSubtitle}>
            Take local moves across Coimbatore. See what you earn on every job
            before you accept it.
          </Text>
        </View>
      </SafeAreaView>

      {/* White Rounded Bottom Card */}
      <View style={styles.bottomCard}>
        {/* Fleet Line Art Row */}
        <View style={styles.fleetRow}>
          <View style={styles.vehicleCol}>
            <CarryVehicleArt type="mini" width={80} />
          </View>
          <View style={styles.vehicleCol}>
            <CarryVehicleArt type="pickup" width={95} />
          </View>
          <View style={styles.vehicleCol}>
            <CarryVehicleArt type="van" width={90} />
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actions}>
          <CarryButton onPress={handleCreate} variant="primary">
            Become a CARRY driver
          </CarryButton>

          <CarryButton onPress={onLogin} variant="secondary">
            I already have an account
          </CarryButton>

          {onSwitchPortal && (
            <Pressable onPress={onSwitchPortal} style={styles.switchButton}>
              <Text style={styles.switchText}>
                Booking a vehicle instead? Switch to Customer
              </Text>
            </Pressable>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.ink,
  },
  heroSection: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "space-between",
    paddingBottom: 24,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 8,
  },
  driverBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 99,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  driverBadgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: "rgba(255,255,255,0.85)",
  },
  heroContent: {
    marginBottom: 8,
  },
  heroHeadline: {
    fontSize: 42,
    fontWeight: "900",
    color: "#FFFFFF",
    letterSpacing: -1.2,
    lineHeight: 46,
  },
  heroHeadlineDim: {
    color: "rgba(255,255,255,0.45)",
  },
  heroSubtitle: {
    fontSize: 15,
    lineHeight: 22,
    color: "rgba(255,255,255,0.7)",
    marginTop: 14,
    maxWidth: 320,
  },
  bottomCard: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 32,
  },
  fleetRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    marginBottom: 20,
    paddingHorizontal: 8,
  },
  vehicleCol: {
    alignItems: "center",
  },
  actions: {
    gap: 10,
  },
  switchButton: {
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },
  switchText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.muted,
  },
});
