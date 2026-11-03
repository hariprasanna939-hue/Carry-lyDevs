import React from "react";
import { View } from "react-native";
import Svg, { Circle, G, Line, Path, Rect } from "react-native-svg";
import { colors } from "../theme/colors";

export type VehicleCategory = "mini" | "small" | "medium" | "large" | "pickup" | "van";

type VehicleArtProps = {
  type: VehicleCategory;
  width?: number;
  inverse?: boolean;
};

type Spec = {
  len: number;
  h: number;
  box: boolean;
};

const specs: Record<string, Spec> = {
  mini: { len: 40, h: 14, box: false },
  small: { len: 54, h: 16, box: false },
  medium: { len: 60, h: 32, box: true },
  large: { len: 80, h: 38, box: true },
  pickup: { len: 54, h: 16, box: false },
  van: { len: 60, h: 32, box: true },
};

/**
 * Geometric vector vehicle line art from CARRY Magic Patterns design system.
 * Renders Mini Truck, Small / Pickup, Medium / Van, and Large Trucks.
 */
export function CarryVehicleArt({
  type,
  width = 140,
  inverse = false,
}: VehicleArtProps) {
  const spec = specs[type] || specs.mini;
  const { len, h, box } = spec;

  const ink = inverse ? "#FFFFFF" : colors.ink;
  const body = inverse ? colors.ink : "#FFFFFF";
  const glass = inverse ? "#444444" : colors.mist;
  const ground = inverse ? "#444444" : colors.line;

  const total = len + 2 + 30;
  const x0 = (140 - total) / 2;
  const cargoX = x0;
  const cabX = x0 + len + 2;
  const top = 50 - h;
  const rearWheel = cargoX + Math.max(14, len * 0.3);
  const frontWheel = cabX + 17;

  const height = (width * 70) / 140;

  return (
    <View style={{ width, height, alignItems: "center", justifyContent: "center" }}>
      <Svg viewBox="0 0 140 70" width={width} height={height}>
        {/* Ground road line */}
        <Line
          x1={x0 - 4}
          y1="64.5"
          x2={x0 + total + 4}
          y2="64.5"
          stroke={ground}
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* Chassis */}
        <Rect
          x={cargoX - 1}
          y="49"
          width={total + 1}
          height="5"
          rx="1.5"
          fill={ink}
        />

        {/* Cargo */}
        {box ? (
          <G>
            <Rect
              x={cargoX}
              y={top}
              width={len}
              height={h}
              rx="2.5"
              fill={body}
              stroke={ink}
              strokeWidth="2"
            />
            <Line
              x1={cargoX + len * 0.5}
              y1={top + 4}
              x2={cargoX + len * 0.5}
              y2="48"
              stroke={ink}
              strokeWidth="1.2"
              opacity={0.35}
            />
            <Line
              x1={cargoX + 5}
              y1={top + 6}
              x2={cargoX + len - 5}
              y2={top + 6}
              stroke={ink}
              strokeWidth="1.2"
              opacity={0.35}
            />
          </G>
        ) : (
          <G>
            <Path
              d={`M${cargoX} ${top} V49 H${cargoX + len} V${top}`}
              fill={body}
              stroke={ink}
              strokeWidth="2"
              strokeLinejoin="round"
            />
            <Line
              x1={cargoX}
              y1={top + 6}
              x2={cargoX + len}
              y2={top + 6}
              stroke={ink}
              strokeWidth="1.2"
              opacity={0.35}
            />
            {/* Cargo load */}
            <Rect
              x={cargoX + 6}
              y={top - 8}
              width={len * 0.34}
              height="10"
              rx="1.5"
              fill={glass}
              stroke={ink}
              strokeWidth="1.6"
            />
            <Rect
              x={cargoX + 8 + len * 0.34}
              y={top - 5}
              width={len * 0.26}
              height="7"
              rx="1.5"
              fill={glass}
              stroke={ink}
              strokeWidth="1.6"
            />
          </G>
        )}

        {/* Driver Cab */}
        <Path
          d={`M${cabX} 49 V24 Q${cabX} 21 ${cabX + 3} 21 H${cabX + 15} Q${cabX + 17} 21 ${cabX + 18.5} 23 L${cabX + 27} 35 Q${cabX + 30} 37 ${cabX + 30} 40 V49 Z`}
          fill={body}
          stroke={ink}
          strokeWidth="2"
          strokeLinejoin="round"
        />
        {/* Cab Window */}
        <Path
          d={`M${cabX + 4} 25 H${cabX + 14.5} L${cabX + 21.5} 35 H${cabX + 4} Z`}
          fill={glass}
          stroke={ink}
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        {/* Door handle */}
        <Rect
          x={cabX + 25}
          y="41"
          width="5"
          height="3"
          rx="1"
          fill={ink}
        />

        {/* Wheels matching CARRY wheel dot design */}
        {[rearWheel, frontWheel].map((cx, idx) => (
          <G key={idx}>
            <Circle cx={cx} cy="56" r="7.5" fill={ink} />
            <Circle cx={cx} cy="56" r="2.6" fill={body} />
          </G>
        ))}
      </Svg>
    </View>
  );
}
