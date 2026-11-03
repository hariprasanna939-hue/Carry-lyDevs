import React, { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { CarryLogo } from "../components/CarryLogo";
import { colors } from "../theme/colors";

interface Props {
  onFinish: () => void;
}

const { width } = Dimensions.get("window");

/**
 * Customer Splash Screen in Pure Monochrome
 * Faithful reproduction of Magic Patterns frame (mC9EjpbuHrBv532KzpcSHZ)
 */
export default function CustomerSplashScreen({ onFinish }: Props) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.96)).current;
  const progressAnim = useRef(new Animated.Value(-60)).current;

  useEffect(() => {
    // Fade & scale in the logo
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 380,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 380,
        useNativeDriver: true,
      }),
    ]).start();

    // Loop progress bar light across the track
    const progressLoop = Animated.loop(
      Animated.timing(progressAnim, {
        toValue: 120,
        duration: 1100,
        useNativeDriver: true,
      })
    );
    progressLoop.start();

    // Smooth transition out after splash duration
    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start(() => {
        onFinish();
      });
    }, 1800);

    return () => {
      clearTimeout(timer);
      progressLoop.stop();
    };
  }, [fadeAnim, scaleAnim, progressAnim, onFinish]);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Center Logo & Tagline */}
      <Animated.View
        style={[
          styles.centerBox,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <CarryLogo size={52} tone="light" variant="wheel" />
        <Text style={styles.tagline}>Move anything. Move smarter.</Text>
      </Animated.View>

      {/* Bottom Progress Indicator & City Footnote */}
      <Animated.View
        style={[
          styles.footer,
          {
            opacity: fadeAnim,
          },
        ]}
      >
        <View style={styles.progressBarTrack}>
          <Animated.View
            style={[
              styles.progressBarLight,
              {
                transform: [{ translateX: progressAnim }],
              },
            ]}
          />
        </View>
        <Text style={styles.cityText}>Now moving Coimbatore</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.pureBlack,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  centerBox: {
    alignItems: "center",
  },
  tagline: {
    marginTop: 14,
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
  progressBarTrack: {
    width: 100,
    height: 2,
    backgroundColor: colors.success, // #444444 track
    borderRadius: 1,
    overflow: "hidden",
  },
  progressBarLight: {
    width: 48,
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
