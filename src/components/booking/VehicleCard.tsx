import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { VehicleCategory } from "../../types/vehicle";
import { colors } from "../../theme/colors";

export interface VehicleCardProps {
  vehicle: VehicleCategory;
  isSelected: boolean;
  onSelect: () => void;
  estimatedPricePaise?: number;
}

export const VehicleCard: React.FC<VehicleCardProps> = ({
  vehicle,
  isSelected,
  onSelect,
  estimatedPricePaise,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onSelect}
      style={[
        styles.card,
        isSelected && styles.selectedCard,
      ]}
    >
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>{vehicle.icon}</Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{vehicle.name}</Text>
        <Text style={styles.tagline}>{vehicle.tagline}</Text>
        <Text style={styles.specs}>
          Cap: {vehicle.capacityKg} kg • {vehicle.dimensions}
        </Text>
      </View>
      <View style={styles.priceContainer}>
        <Text style={styles.price}>
          ₹{Math.round((estimatedPricePaise || vehicle.baseFarePaise) / 100)}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default VehicleCard;

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 14,
    marginVertical: 6,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  selectedCard: {
    borderColor: colors.primary,
    backgroundColor: colors.customerTint,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 10,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  icon: {
    fontSize: 26,
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.deepNavy,
  },
  tagline: {
    fontSize: 12,
    color: colors.secondaryText,
    marginTop: 2,
  },
  specs: {
    fontSize: 11,
    color: colors.secondaryText,
    marginTop: 4,
    fontWeight: "500",
  },
  priceContainer: {
    marginLeft: 8,
    alignItems: "flex-end",
  },
  price: {
    fontSize: 16,
    fontWeight: "800",
    color: colors.deepNavy,
  },
});
