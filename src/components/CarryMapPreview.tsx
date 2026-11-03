import React from "react";
import { StyleSheet, View } from "react-native";
import Svg, { Circle, Path, Rect } from "react-native-svg";
import { colors } from "../theme/colors";

type MapPreviewProps = {
  height?: number;
  showRoute?: boolean;
  progress?: number;
};

const ROUTE = "M70 230 L70 170 L150 170 L150 110 L250 110 L250 60 L320 60";

/**
 * Geometric Vector Map Preview from CARRY Magic Patterns design.
 * Features grid city blocks, Coimbatore style transit route, pickup ring, drop square, and vehicle dot.
 */
export function CarryMapPreview({
  height = 170,
  showRoute = true,
}: MapPreviewProps) {
  const blocks = [
    [0, 0, 56, 56],
    [84, 0, 52, 56],
    [164, 0, 72, 56],
    [264, 0, 126, 56],
    [0, 84, 56, 92],
    [84, 84, 52, 92],
    [164, 84, 72, 22],
    [264, 84, 40, 22],
    [332, 84, 58, 22],
    [164, 134, 72, 42],
    [264, 134, 126, 42],
    [0, 204, 56, 96],
    [84, 204, 152, 40],
    [84, 272, 152, 28],
    [264, 204, 126, 96],
  ];

  return (
    <View style={[styles.container, { height }]}>
      <Svg viewBox="0 0 390 280" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
        <Rect width="390" height="280" fill={colors.mist} />

        {/* City Blocks */}
        {blocks.map(([x, y, w, h], idx) => (
          <Rect
            key={idx}
            x={x + 4}
            y={y + 4}
            width={w - 8}
            height={h - 8}
            rx={6}
            fill={colors.paper}
          />
        ))}

        {/* Green park / water zone */}
        <Rect x="272" y="190" width="110" height="80" rx="8" fill={colors.line} />
        <Path
          d="M0 140 Q120 130 200 150 T390 140"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="8"
        />

        {showRoute && (
          <>
            {/* White outline route */}
            <Path
              d={ROUTE}
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="10"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
            {/* Black active route line */}
            <Path
              d={ROUTE}
              fill="none"
              stroke={colors.ink}
              strokeWidth="4.5"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
            {/* Pickup: White ring with black border */}
            <Circle
              cx="70"
              cy="230"
              r="10"
              fill="#FFFFFF"
              stroke={colors.ink}
              strokeWidth="4"
            />
            {/* Drop: Black square */}
            <Rect
              x="309"
              y="49"
              width="22"
              height="22"
              rx="5"
              fill={colors.ink}
            />
            <Rect
              x="316"
              y="56"
              width="8"
              height="8"
              rx="1.5"
              fill="#FFFFFF"
            />
            {/* Vehicle indicator at midway point (150, 140) */}
            <Circle cx="150" cy="140" r="14" fill={colors.ink} opacity={0.12} />
            <Circle cx="150" cy="140" r="8" fill={colors.ink} />
          </>
        )}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    borderRadius: 18,
    overflow: "hidden",
    backgroundColor: colors.mist,
    borderWidth: 1,
    borderColor: colors.line,
  },
});
