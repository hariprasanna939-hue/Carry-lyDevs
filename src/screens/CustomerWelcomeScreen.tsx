import React from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { CarryLogo } from "../components/CarryLogo";
import { CarryVehicleArt } from "../components/CarryVehicleArt";
import { colors } from "../theme/colors";

interface Props {
  onGetStarted: () => void;
  onLogin: () => void;
}

/**
 * Customer Welcome Screen in Pure Monochrome
 * Faithful reproduction of Magic Patterns frame (mURvuBTY2MQnD33fCx7sn6)
 */
export default function CustomerWelcomeScreen({
  onGetStarted,
  onLogin,
}: Props) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <View style={styles.container}>
        {/* Top Header */}
        <View style={styles.header}>
          <CarryLogo size={28} tone="dark" variant="wheel" />
        </View>

        {/* Fleet Illustration: Large, Medium, Small, Mini on one line */}
        <View style={styles.fleetWrapper}>
          <View style={styles.fleetRow}>
            <View style={[styles.vehicleWrapper, { zIndex: 1 }]}>
              <CarryVehicleArt type="large" width={116} />
            </View>
            <View
              style={[
                styles.vehicleWrapper,
                { marginLeft: -18, zIndex: 2 },
              ]}
            >
              <CarryVehicleArt type="medium" width={98} />
            </View>
            <View
              style={[
                styles.vehicleWrapper,
                { marginLeft: -18, zIndex: 3 },
              ]}
            >
              <CarryVehicleArt type="small" width={86} />
            </View>
            <View
              style={[
                styles.vehicleWrapper,
                { marginLeft: -16, zIndex: 4 },
              ]}
            >
              <CarryVehicleArt type="mini" width={78} />
            </View>
          </View>
          {/* Subtle ground baseline */}
          <View style={styles.groundLine} />
        </View>

        {/* Content Section */}
        <View style={styles.content}>
          <Text style={styles.heading}>{"Move anything.\nMove smarter."}</Text>

          <Text style={styles.description}>
            Book a mini truck, pickup or van across Coimbatore — now, or for
            later — with helpers if you need them.
          </Text>

          {/* Action Buttons */}
          <View style={styles.buttonGroup}>
            <Pressable
              onPress={onGetStarted}
              style={({ pressed }) => [
                styles.primaryBtn,
                pressed && styles.btnPressed,
              ]}
              accessibilityRole="button"
              accessibilityLabel="Get started"
            >
              <Text style={styles.primaryBtnText}>Get started</Text>
            </Pressable>

            <Pressable
              onPress={onLogin}
              style={({ pressed }) => [
                styles.secondaryBtn,
                pressed && styles.btnPressed,
              ]}
              accessibilityRole="button"
              accessibilityLabel="I already have an account"
            >
              <Text style={styles.secondaryBtnText}>
                I already have an account
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
  container: {
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 24,
  },
  header: {
    paddingTop: 8,
  },
  fleetWrapper: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: 28,
  },
  fleetRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center",
  },
  vehicleWrapper: {
    alignItems: "center",
  },
  groundLine: {
    width: "100%",
    height: 1,
    backgroundColor: colors.borderGrey,
    marginTop: 2,
  },
  content: {
    width: "100%",
  },
  heading: {
    fontSize: 38,
    fontWeight: "900",
    color: colors.primaryBlack,
    letterSpacing: -1.2,
    lineHeight: 42,
  },
  description: {
    fontSize: 16,
    color: colors.secondaryText,
    lineHeight: 24,
    marginTop: 14,
  },
  buttonGroup: {
    marginTop: 32,
    gap: 12,
  },
  primaryBtn: {
    height: 52,
    borderRadius: 16,
    backgroundColor: colors.primaryBlack,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryBtn: {
    height: 52,
    borderRadius: 16,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.borderGrey,
    alignItems: "center",
    justifyContent: "center",
  },
  btnPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.985 }],
  },
  primaryBtnText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: -0.2,
  },
  secondaryBtnText: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.primaryBlack,
    letterSpacing: -0.2,
  },
});
