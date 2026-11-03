import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { FareBreakdown } from "../../types/booking";
import { colors } from "../../theme/colors";

export interface FareSummaryProps {
  fare: FareBreakdown;
  distanceKm: number;
}

export const FareSummary: React.FC<FareSummaryProps> = ({ fare, distanceKm }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Fare Breakdown</Text>
      <View style={styles.row}>
        <Text style={styles.label}>Base Fare</Text>
        <Text style={styles.value}>₹{Math.round(fare.baseFarePaise / 100)}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Distance ({distanceKm} km)</Text>
        <Text style={styles.value}>₹{Math.round(fare.distanceFarePaise / 100)}</Text>
      </View>
      {fare.helperFarePaise > 0 ? (
        <View style={styles.row}>
          <Text style={styles.label}>Helper Assistance</Text>
          <Text style={styles.value}>₹{Math.round(fare.helperFarePaise / 100)}</Text>
        </View>
      ) : null}
      <View style={[styles.row, styles.totalRow]}>
        <Text style={styles.totalLabel}>Total Estimate</Text>
        <Text style={styles.totalValue}>₹{Math.round(fare.totalFarePaise / 100)}</Text>
      </View>
    </View>
  );
};

export default FareSummary;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 16,
    marginVertical: 10,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  header: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.deepNavy,
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 4,
  },
  label: {
    fontSize: 13,
    color: colors.secondaryText,
  },
  value: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.deepNavy,
  },
  totalRow: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: "800",
    color: colors.deepNavy,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.primary,
  },
});
