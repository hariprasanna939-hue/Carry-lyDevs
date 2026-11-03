import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CarryLogo } from "../components/CarryLogo";
import { CarryButton } from "../components/CarryUI";
import { CarryVehicleArt } from "../components/CarryVehicleArt";
import { colors } from "../theme/colors";

type Props = {
  onGetStarted: () => void;
  onLogin: () => void;
  onSwitchToDriver?: () => void;
};

/**
 * Customer Welcome Screen faithfully reproduced from Magic Patterns design
 * Frame ID: mURvuBTY2MQnD33fCx7sn6
 */
export default function CustomerWelcomeScreen({
  onGetStarted,
  onLogin,
  onSwitchToDriver,
}: Props) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header with CARRY wordmark */}
        <View style={styles.header}>
          <CarryLogo size={28} tone="dark" variant="wheel" />
        </View>

        {/* Fleet artwork: largest to smallest sitting on road line */}
        <View style={styles.fleetContainer}>
          <View style={styles.fleetRow}>
            <View style={styles.fleetItem}>
              <CarryVehicleArt type="large" width={110} />
            </View>
            <View style={[styles.fleetItem, { marginLeft: -16 }]}>
              <CarryVehicleArt type="medium" width={95} />
            </View>
            <View style={[styles.fleetItem, { marginLeft: -16 }]}>
              <CarryVehicleArt type="small" width={85} />
            </View>
            <View style={[styles.fleetItem, { marginLeft: -16 }]}>
              <CarryVehicleArt type="mini" width={80} />
            </View>
          </View>
        </View>

        {/* Hero Typography & Actions */}
        <View style={styles.content}>
          <Text style={styles.headline}>{"Move anything.\nMove smarter."}</Text>
          <Text style={styles.body}>
            Book a mini truck, pickup or van across Coimbatore — now, or for later
            — with helpers if you need them.
          </Text>

          <View style={styles.actions}>
            <CarryButton onPress={onGetStarted} variant="primary">
              Get started
            </CarryButton>
            <CarryButton onPress={onLogin} variant="secondary">
              I already have an account
            </CarryButton>

            {onSwitchToDriver && (
              <CarryButton
                onPress={onSwitchToDriver}
                variant="ghost"
                size="md"
              >
                Driving a truck? Switch to Driver Portal →
              </CarryButton>
            )}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  container: {
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 24,
  },
  header: {
    paddingTop: 8,
  },
  fleetContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 16,
  },
  fleetRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center",
  },
  fleetItem: {
    alignItems: "center",
  },
  content: {
    width: "100%",
  },
  headline: {
    fontSize: 38,
    fontWeight: "900",
    color: colors.ink,
    letterSpacing: -1.2,
    lineHeight: 42,
  },
  body: {
    marginTop: 14,
    fontSize: 16,
    lineHeight: 24,
    color: colors.muted,
  },
  actions: {
    marginTop: 28,
    gap: 12,
  },
});
