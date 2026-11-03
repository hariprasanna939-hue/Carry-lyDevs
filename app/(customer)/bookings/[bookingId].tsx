import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { colors } from "../../../src/theme/colors";
import Button from "../../../src/components/ui/Button";
import Badge from "../../../src/components/ui/Badge";
import { bookingsService } from "../../../src/features/bookings/bookings.service";
import { Booking } from "../../../src/types/booking";
import { BOOKING_STATUS_LABELS } from "../../../src/constants/booking-status";

export default function BookingDetailsScreen() {
  const router = useRouter();
  const { bookingId } = useLocalSearchParams<{ bookingId: string }>();
  const [booking, setBooking] = useState<Booking | null>(null);

  useEffect(() => {
    if (!bookingId) return;
    return bookingsService.listenBooking(bookingId, setBooking);
  }, [bookingId]);

  if (!booking) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading trip details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.statusCard}>
          <View style={styles.statusHeader}>
            <Text style={styles.bookingId}>TRIP #{booking.id.slice(-6).toUpperCase()}</Text>
            <Badge
              label={BOOKING_STATUS_LABELS[booking.status] || booking.status}
              variant={booking.status === "completed" ? "success" : "primary"}
            />
          </View>
          <Text style={styles.vehicleCategory}>{booking.vehicleCategory.toUpperCase()}</Text>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Route Information</Text>
          <View style={styles.routeItem}>
            <Text style={styles.pointLabel}>🟢 PICKUP</Text>
            <Text style={styles.pointAddress}>{booking.pickup.address}</Text>
          </View>
          <View style={styles.routeItem}>
            <Text style={styles.pointLabel}>🔴 DROPOFF</Text>
            <Text style={styles.pointAddress}>{booking.dropoff.address}</Text>
          </View>
        </View>

        {booking.pickupOtp ? (
          <View style={styles.otpCard}>
            <Text style={styles.otpLabel}>PICKUP VERIFICATION OTP</Text>
            <Text style={styles.otpValue}>{booking.pickupOtp}</Text>
            <Text style={styles.otpHint}>Share this OTP with driver once they arrive at pickup</Text>
          </View>
        ) : null}

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Fare & Payment</Text>
          <View style={styles.fareRow}>
            <Text style={styles.fareLabel}>Total Fare</Text>
            <Text style={styles.fareAmount}>₹{Math.round(booking.fare.totalFarePaise / 100)}</Text>
          </View>
          <View style={styles.fareRow}>
            <Text style={styles.fareLabel}>Payment Mode</Text>
            <Text style={styles.fareValue}>{(booking.paymentMethod || "cash").toUpperCase()}</Text>
          </View>
          <View style={styles.fareRow}>
            <Text style={styles.fareLabel}>Payment Status</Text>
            <Text style={styles.fareValue}>{booking.paymentStatus.toUpperCase()}</Text>
          </View>
        </View>

        {booking.status !== "completed" && booking.status !== "cancelled" ? (
          <Button
            title="Open Live Tracking"
            size="large"
            onPress={() => router.push(`/(customer)/tracking/${booking.id}` as any)}
            style={{ marginTop: 12 }}
          />
        ) : (
          <Button
            title="Rate Trip"
            variant="outline"
            onPress={() => router.push("/(customer)/reviews")}
            style={{ marginTop: 12 }}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    padding: 20,
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    color: colors.secondaryText,
    fontSize: 14,
  },
  statusCard: {
    backgroundColor: colors.surface,
    padding: 18,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: colors.border,
    marginBottom: 16,
  },
  statusHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  bookingId: {
    fontSize: 15,
    fontWeight: "800",
    color: colors.deepNavy,
  },
  vehicleCategory: {
    fontSize: 13,
    color: colors.secondaryText,
    marginTop: 6,
    fontWeight: "600",
  },
  sectionCard: {
    backgroundColor: colors.surface,
    padding: 18,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: colors.border,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.deepNavy,
    marginBottom: 12,
  },
  routeItem: {
    marginBottom: 10,
  },
  pointLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.secondaryText,
    letterSpacing: 0.5,
  },
  pointAddress: {
    fontSize: 14,
    color: colors.text,
    fontWeight: "500",
    marginTop: 2,
  },
  otpCard: {
    backgroundColor: colors.customerTint,
    padding: 18,
    borderRadius: 16,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: colors.primary,
    marginBottom: 16,
  },
  otpLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.primary,
    letterSpacing: 1,
  },
  otpValue: {
    fontSize: 32,
    fontWeight: "900",
    color: colors.primary,
    marginVertical: 4,
    letterSpacing: 4,
  },
  otpHint: {
    fontSize: 12,
    color: colors.secondaryText,
    textAlign: "center",
  },
  fareRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 4,
  },
  fareLabel: {
    fontSize: 14,
    color: colors.secondaryText,
  },
  fareValue: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.deepNavy,
  },
  fareAmount: {
    fontSize: 16,
    fontWeight: "800",
    color: colors.deepNavy,
  },
});
