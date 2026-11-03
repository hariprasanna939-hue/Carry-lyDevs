import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { CarryLogo } from "../components/CarryLogo";
import { colors } from "../theme/colors";

type Props = {
  onFinish: () => void;
};

/**
 * Customer Splash Screen in Pure Monochrome
 * Matching Magic Patterns design (Frame ID: mC9EjpbuHrBv532KzpcSHZ)
 */
export default function CustomerSplashScreen({ onFinish }: Props) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 2000);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <View style={styles.container}>
      <View style={styles.centerBox}>
        <CarryLogo size={48} tone="light" variant="wheel" />
        <Text style={styles.tagline}>Move anything. Move smarter.</Text>
      </View>

      <View style={styles.footer}>
        <View style={styles.progressBarBg}>
          <View style={styles.progressBarFill} />
        </View>
        <Text style={styles.cityText}>Now moving Coimbatore</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primaryBlack,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  centerBox: {
    alignItems: "center",
  },
  tagline: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: "600",
    color: colors.disabledGrey,
    letterSpacing: -0.2,
  },
  footer: {
    position: "absolute",
    bottom: 50,
    alignItems: "center",
    gap: 12,
  },
  progressBarBg: {
    width: 90,
    height: 2,
    backgroundColor: colors.success, // #444444
    borderRadius: 1,
    overflow: "hidden",
  },
  progressBarFill: {
    width: "50%",
    height: "100%",
    backgroundColor: colors.white,
    borderRadius: 1,
  },
  cityText: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.secondaryText,
    letterSpacing: 0.5,
  },
});
