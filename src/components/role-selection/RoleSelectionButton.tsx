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
  disabled?: boolean;
  style?: ViewStyle;
}

export function RoleSelectionButton({
  label,
  onPress,
  disabled = false,
  style,
}: Props) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        disabled ? styles.buttonDisabled : styles.buttonEnabled,
        pressed && !disabled && styles.buttonPressed,
        style,
      ]}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      accessibilityLabel={label}
    >
      <Text
        style={[
          styles.label,
          disabled ? styles.labelDisabled : styles.labelEnabled,
        ]}
      >
        {label}
      </Text>
      {!disabled && (
        <View style={styles.iconWrapper}>
          <ArrowRight size={18} color="#FFFFFF" strokeWidth={2.5} />
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 54,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    gap: 8,
  },
  buttonEnabled: {
    backgroundColor: colors.primaryBlack,
    shadowColor: colors.primaryBlack,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 3,
  },
  buttonDisabled: {
    backgroundColor: colors.lightGrey,
  },
  buttonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.985 }],
  },
  label: {
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: -0.2,
  },
  labelEnabled: {
    color: "#FFFFFF",
  },
  labelDisabled: {
    color: colors.disabledGrey,
  },
  iconWrapper: {
    marginLeft: 2,
  },
});
