import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors } from "../../theme/colors";

export interface LocationInputProps {
  label: string;
  value?: string;
  placeholder: string;
  type?: "pickup" | "dropoff";
  onPress: () => void;
}

export const LocationInput: React.FC<LocationInputProps> = ({
  label,
  value,
  placeholder,
  type = "pickup",
  onPress,
}) => {
  return (
    <TouchableOpacity activeOpacity={0.7} onPress={onPress} style={styles.container}>
      <View style={[styles.dot, type === "pickup" ? styles.pickupDot : styles.dropoffDot]} />
      <View style={styles.textContainer}>
        <Text style={styles.label}>{label}</Text>
        <Text
          numberOfLines={1}
          style={[styles.value, !value && styles.placeholder]}
        >
          {value || placeholder}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default LocationInput;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.border,
    marginVertical: 6,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  pickupDot: {
    backgroundColor: colors.success,
  },
  dropoffDot: {
    backgroundColor: colors.danger,
  },
  textContainer: {
    flex: 1,
  },
  label: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.secondaryText,
    textTransform: "uppercase",
    marginBottom: 2,
  },
  value: {
    fontSize: 14,
    color: colors.text,
    fontWeight: "600",
  },
  placeholder: {
    color: colors.secondaryText,
    fontWeight: "400",
  },
});
