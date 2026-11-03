import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Svg, { Circle, Rect } from "react-native-svg";
import { colors } from "../theme/colors";

type LogoProps = {
  size?: number;
  tone?: "dark" | "light";
  variant?: "wheel" | "crate";
  showBadge?: boolean;
  badgeText?: string;
};

/**
 * CARRY brand logo faithfully implemented from Magic Patterns design files.
 * Supports:
 * - wheel dot (Customer app)
 * - crate dot (Driver app)
 * - dark and light tones
 */
export function CarryLogo({
  size = 28,
  tone = "dark",
  variant = "wheel",
  showBadge = false,
  badgeText = "Driver",
}: LogoProps) {
  const isDark = tone === "dark";
  const ink = isDark ? colors.ink : "#FFFFFF";
  const hub = isDark ? "#FFFFFF" : colors.ink;

  const dotSize = size * 0.3;

  return (
    <View style={styles.container}>
      <View style={styles.wordmarkRow}>
        <Text
          style={[
            styles.text,
            {
              fontSize: size,
              color: ink,
              letterSpacing: -size * 0.06,
            },
          ]}
        >
          carry
        </Text>

        <View
          style={[
            styles.dotWrapper,
            {
              width: dotSize,
              height: dotSize,
              marginLeft: size * 0.06,
              marginBottom: size * 0.08,
            },
          ]}
        >
          {variant === "wheel" ? (
            <Svg width={dotSize} height={dotSize} viewBox="0 0 10 10">
              <Circle cx="5" cy="5" r="5" fill={ink} />
              <Circle cx="5" cy="5" r="1.6" fill={hub} />
            </Svg>
          ) : (
            <Svg width={dotSize} height={dotSize} viewBox="0 0 10 10">
              <Rect x="1" y="1" width="8" height="8" rx="1.5" fill={ink} />
            </Svg>
          )}
        </View>
      </View>

      {showBadge && (
        <View
          style={[
            styles.badge,
            {
              borderColor: isDark ? colors.line : "rgba(255,255,255,0.3)",
              backgroundColor: isDark ? colors.mist : "rgba(255,255,255,0.12)",
            },
          ]}
        >
          <Text
            style={[
              styles.badgeText,
              { color: isDark ? colors.ink : "#FFFFFF" },
            ]}
          >
            {badgeText}
          </Text>
        </View>
      )}
    </View>
  );
}

/**
 * CARRY App-icon mark: square tile with "c."
 */
export function CarryLogoMark({
  size = 56,
  tone = "dark",
}: {
  size?: number;
  tone?: "dark" | "light";
}) {
  const isDark = tone === "dark";
  const bg = isDark ? colors.ink : "#FFFFFF";
  const fg = isDark ? "#FFFFFF" : colors.ink;
  const dotSize = size * 0.16;

  return (
    <View
      style={[
        styles.markBox,
        {
          width: size,
          height: size,
          borderRadius: size * 0.28,
          backgroundColor: bg,
        },
      ]}
    >
      <View style={styles.markRow}>
        <Text
          style={[
            styles.markChar,
            {
              fontSize: size * 0.54,
              color: fg,
              marginTop: -size * 0.08,
            },
          ]}
        >
          c
        </Text>
        <Svg
          width={dotSize}
          height={dotSize}
          viewBox="0 0 10 10"
          style={{ marginLeft: size * 0.03 }}
        >
          <Circle cx="5" cy="5" r="5" fill={fg} />
          <Circle cx="5" cy="5" r="1.6" fill={bg} />
        </Svg>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  wordmarkRow: {
    flexDirection: "row",
    alignItems: "flex-end",
  },
  text: {
    fontWeight: "900",
    includeFontPadding: false,
  },
  dotWrapper: {
    justifyContent: "flex-end",
  },
  badge: {
    marginLeft: 12,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 99,
    borderWidth: 1,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "700",
  },
  markBox: {
    alignItems: "center",
    justifyContent: "center",
  },
  markRow: {
    flexDirection: "row",
    alignItems: "flex-end",
  },
  markChar: {
    fontWeight: "900",
    letterSpacing: -1,
  },
});
