import React from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Svg, { Circle, Line, Path, Rect } from "react-native-svg";
import { Check } from "lucide-react-native";
import { CarryVehicleArt } from "../CarryVehicleArt";
import { colors } from "../../theme/colors";

export type RoleType = "customer" | "driver";

interface Props {
  role: RoleType;
  title: string;
  description: string;
  selected: boolean;
  onSelect: () => void;
}

/**
 * Customer Illustration: A customer with a goods carton and mini truck
 */
function CustomerIllustration() {
  return (
    <View style={styles.illustrationWrapper}>
      <Svg width={72} height={52} viewBox="0 0 72 52" fill="none">
        {/* Customer figure */}
        <Circle cx="20" cy="14" r="7" stroke={colors.primaryBlack} strokeWidth="2" />
        <Path
          d="M10 38C10 30 14 26 20 26C26 26 30 30 30 38"
          stroke={colors.primaryBlack}
          strokeWidth="2"
          strokeLinecap="round"
        />
        {/* Package carton */}
        <Rect
          x="26"
          y="24"
          width="18"
          height="16"
          rx="3"
          stroke={colors.primaryBlack}
          strokeWidth="2"
          fill="#FFFFFF"
        />
        <Line x1="26" y1="30" x2="44" y2="30" stroke={colors.borderGrey} strokeWidth="1.5" />
        <Line x1="35" y1="24" x2="35" y2="40" stroke={colors.borderGrey} strokeWidth="1.5" />
        {/* Mini Truck silhouette behind */}
        <Path
          d="M48 38H68V26H58L54 32H48V38Z"
          stroke={colors.secondaryText}
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        <Circle cx="53" cy="38" r="3.5" stroke={colors.secondaryText} strokeWidth="1.8" />
        <Circle cx="63" cy="38" r="3.5" stroke={colors.secondaryText} strokeWidth="1.8" />
      </Svg>
    </View>
  );
}

/**
 * Driver Illustration: A professional mini-truck commercial driver with steering & delivery route
 */
function DriverIllustration() {
  return (
    <View style={styles.illustrationWrapper}>
      <Svg width={72} height={52} viewBox="0 0 72 52" fill="none">
        {/* Tata Ace Mini Truck */}
        <Path
          d="M6 36H56V20H42L36 28H6V36Z"
          stroke={colors.primaryBlack}
          strokeWidth="2"
          strokeLinejoin="round"
          fill="#FFFFFF"
        />
        {/* Wheels */}
        <Circle cx="16" cy="36" r="4.5" stroke={colors.primaryBlack} strokeWidth="2" fill="#FFFFFF" />
        <Circle cx="46" cy="36" r="4.5" stroke={colors.primaryBlack} strokeWidth="2" fill="#FFFFFF" />
        {/* Driver in cab */}
        <Circle cx="41" cy="24" r="3" stroke={colors.primaryBlack} strokeWidth="1.8" />
        <Path d="M38 29C39 27.5 43 27.5 44 29" stroke={colors.primaryBlack} strokeWidth="1.8" />
        {/* Earnings / GPS indicator */}
        <Circle cx="60" cy="12" r="8" stroke={colors.primaryBlack} strokeWidth="2" fill="#FFFFFF" />
        <Path d="M57 12H63" stroke={colors.primaryBlack} strokeWidth="1.8" strokeLinecap="round" />
        <Path d="M60 9V15" stroke={colors.primaryBlack} strokeWidth="1.8" strokeLinecap="round" />
      </Svg>
    </View>
  );
}

export function RoleSelectionCard({
  role,
  title,
  description,
  selected,
  onSelect,
}: Props) {
  return (
    <Pressable
      onPress={onSelect}
      style={({ pressed }) => [
        styles.card,
        selected ? styles.cardSelected : styles.cardDefault,
        pressed && styles.cardPressed,
      ]}
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      accessibilityLabel={`${title}. ${description}`}
    >
      <View style={styles.topRow}>
        <View style={styles.headerLeft}>
          <View
            style={[
              styles.radioCircle,
              selected ? styles.radioSelected : styles.radioDefault,
            ]}
          >
            {selected && <Check size={14} color="#FFFFFF" strokeWidth={3} />}
          </View>
          <Text style={styles.title}>{title}</Text>
        </View>

        {/* Visual Illustration */}
        {role === "customer" ? (
          <CustomerIllustration />
        ) : (
          <DriverIllustration />
        )}
      </View>

      <Text style={styles.description}>{description}</Text>

      {/* Role Feature Highlights */}
      <View style={styles.tagsRow}>
        {role === "customer" ? (
          <>
            <View style={styles.pillTag}>
              <Text style={styles.pillText}>Mini Trucks on Demand</Text>
            </View>
            <View style={styles.pillTag}>
              <Text style={styles.pillText}>Helpers & Floor Moving</Text>
            </View>
          </>
        ) : (
          <>
            <View style={styles.pillTag}>
              <Text style={styles.pillText}>Daily Payouts via IMPS</Text>
            </View>
            <View style={styles.pillTag}>
              <Text style={styles.pillText}>Coimbatore Local Trips</Text>
            </View>
          </>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.cardSurface,
    borderRadius: 22,
    padding: 20,
    marginVertical: 6,
  },
  cardDefault: {
    borderWidth: 1.5,
    borderColor: colors.borderGrey,
  },
  cardSelected: {
    borderWidth: 2.5,
    borderColor: colors.primaryBlack,
    backgroundColor: "#FFFFFF",
    shadowColor: colors.primaryBlack,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  cardPressed: {
    opacity: 0.95,
    transform: [{ scale: 0.99 }],
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  radioCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  radioDefault: {
    borderWidth: 2,
    borderColor: colors.borderGrey,
    backgroundColor: "#FFFFFF",
  },
  radioSelected: {
    backgroundColor: colors.primaryBlack,
    borderColor: colors.primaryBlack,
    borderWidth: 2,
  },
  title: {
    fontSize: 20,
    fontWeight: "900",
    color: colors.primaryBlack,
    letterSpacing: -0.4,
  },
  illustrationWrapper: {
    alignItems: "center",
    justifyContent: "center",
    paddingLeft: 8,
  },
  description: {
    fontSize: 14,
    color: colors.secondaryText,
    lineHeight: 21,
    marginTop: 12,
    marginBottom: 16,
  },
  tagsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  pillTag: {
    backgroundColor: colors.lightGrey,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  pillText: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.mainText,
  },
});
