import React from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";
import { ArrowRight } from "lucide-react-native";
import { colors } from "../../theme/colors";

interface Props {
  label: string;
  onPress: () => void;
  style?: ViewStyle;
  showArrow?: boolean;
}

export function OnboardingButton({
  label,
  onPress,
  style,
  showArrow = true,
}: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        pressed && styles.pressed,
        style,
      ]}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <Text style={styles.label}>{label}</Text>
      {showArrow && (
        <View style={styles.iconWrapper}>
          <ArrowRight size={18} color="#FFFFFF" strokeWidth={2.5} />
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 52,
    paddingHorizontal: 22,
    borderRadius: 16,
    backgroundColor: colors.primaryBlack,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.985 }],
  },
  label: {
    fontSize: 16,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: -0.2,
  },
  iconWrapper: {
    marginLeft: 2,
  },
});
