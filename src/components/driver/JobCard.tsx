import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Booking } from "../../types/booking";
import { colors } from "../../theme/colors";
import Button from "../ui/Button";

export interface JobCardProps {
  booking: Booking;
  onAccept?: () => void;
  onDecline?: () => void;
  onViewDetails?: () => void;
}

export const JobCard: React.FC<JobCardProps> = ({
  booking,
  onAccept,
  onDecline,
  onViewDetails,
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.vehicleType}>{booking.vehicleCategory.toUpperCase()}</Text>
        <Text style={styles.fare}>₹{Math.round(booking.fare.totalFarePaise / 100)}</Text>
      </View>
      <View style={styles.locationContainer}>
        <Text style={styles.locLabel}>PICKUP</Text>
        <Text numberOfLines={1} style={styles.locText}>{booking.pickup.address}</Text>
        <Text style={[styles.locLabel, { marginTop: 8 }]}>DROPOFF</Text>
        <Text numberOfLines={1} style={styles.locText}>{booking.dropoff.address}</Text>
      </View>
      {onAccept && onDecline ? (
        <View style={styles.actionRow}>
          <Button
            title="Decline"
            variant="outline"
            size="small"
            style={{ flex: 1, marginRight: 8 }}
            onPress={onDecline}
          />
          <Button
            title="Accept Job"
            size="small"
            style={{ flex: 1.5 }}
            onPress={onAccept}
          />
        </View>
      ) : onViewDetails ? (
        <Button
          title="View Trip"
          size="small"
          style={{ marginTop: 12 }}
          onPress={onViewDetails}
        />
      ) : null}
    </View>
  );
};

export default JobCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    marginVertical: 8,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  vehicleType: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.primary,
  },
  fare: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.deepNavy,
  },
  locationContainer: {
    paddingVertical: 8,
  },
  locLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: colors.secondaryText,
    letterSpacing: 0.5,
  },
  locText: {
    fontSize: 13,
    color: colors.text,
    fontWeight: "500",
    marginTop: 2,
  },
  actionRow: {
    flexDirection: "row",
    marginTop: 12,
  },
});
