import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Booking } from "../../types/booking";
import { colors } from "../../theme/colors";
import { BOOKING_STATUS_LABELS } from "../../constants/booking-status";

export interface ActiveTripCardProps {
  booking: Booking;
  onPress: () => void;
}

export const ActiveTripCard: React.FC<ActiveTripCardProps> = ({ booking, onPress }) => {
  return (
    <TouchableOpacity activeOpacity={0.8} onPress={onPress} style={styles.card}>
      <View style={styles.statusRow}>
        <View style={styles.liveIndicator} />
        <Text style={styles.statusText}>
          {BOOKING_STATUS_LABELS[booking.status] || booking.status}
        </Text>
      </View>
      <Text style={styles.destination} numberOfLines={1}>
        To: {booking.dropoff.address}
      </Text>
      <View style={styles.footerRow}>
        <Text style={styles.vehicleCategory}>{booking.vehicleCategory}</Text>
        <Text style={styles.fare}>₹{Math.round(booking.fare.totalFarePaise / 100)}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default ActiveTripCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    marginVertical: 8,
    borderWidth: 1.5,
    borderColor: colors.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  liveIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.primary,
    textTransform: "uppercase",
  },
  destination: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.deepNavy,
    marginBottom: 12,
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  vehicleCategory: {
    fontSize: 13,
    color: colors.secondaryText,
    textTransform: "capitalize",
  },
  fare: {
    fontSize: 16,
    fontWeight: "800",
    color: colors.deepNavy,
  },
});
