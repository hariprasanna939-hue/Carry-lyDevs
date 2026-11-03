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
import RouteMap from "../../../src/components/maps/RouteMap";
import { bookingsService } from "../../../src/features/bookings/bookings.service";
import { trackingService } from "../../../src/features/tracking/tracking.service";
import { Booking } from "../../../src/types/booking";
import { BOOKING_STATUS_LABELS } from "../../../src/constants/booking-status";

export default function CustomerTrackingScreen() {
  const router = useRouter();
  const { bookingId } = useLocalSearchParams<{ bookingId: string }>();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [driverLoc, setDriverLoc] = useState<{ latitude: number; longitude: number } | null>(null);

  useEffect(() => {
    if (!bookingId) return;
    return bookingsService.listenBooking(bookingId, setBooking);
  }, [bookingId]);

  useEffect(() => {
    if (!booking?.driverId) return;
    return trackingService.listenDriverLocation(booking.driverId, (loc) => {
      if (loc) {
        setDriverLoc({ latitude: loc.latitude, longitude: loc.longitude });
      }
    });
  }, [booking?.driverId]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <RouteMap
          pickup={booking?.pickup}
          dropoff={booking?.dropoff}
          driverLocation={driverLoc}
          style={{ height: 260 }}
        />

        <View style={styles.statusPanel}>
          <Text style={styles.statusLabel}>CURRENT STATUS</Text>
          <Text style={styles.statusHeading}>
            {booking ? BOOKING_STATUS_LABELS[booking.status] || booking.status : "Connecting..."}
          </Text>
          <Text style={styles.statusSub}>
            {booking?.driverId
              ? "Driver is en route to pickup point"
              : "Locating nearest verified driver in Coimbatore..."}
          </Text>
        </View>

        {booking?.pickupOtp ? (
          <View style={styles.otpBanner}>
            <Text style={styles.otpLabel}>SHARE OTP AT PICKUP</Text>
            <Text style={styles.otpNumber}>{booking.pickupOtp}</Text>
          </View>
        ) : null}

        <View style={styles.actions}>
          <Button
            title="Payment Details"
            variant="outline"
            onPress={() => router.push(`/(customer)/payments/${bookingId}` as any)}
          />
          <Button
            title="Trip Details"
            style={{ marginTop: 10 }}
            onPress={() => router.push(`/(customer)/bookings/${bookingId}` as any)}
          />
        </View>
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
  statusPanel: {
    backgroundColor: colors.surface,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: colors.border,
    marginVertical: 14,
  },
  statusLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.secondaryText,
    letterSpacing: 0.5,
  },
  statusHeading: {
    fontSize: 20,
    fontWeight: "800",
    color: colors.deepNavy,
    marginTop: 4,
  },
  statusSub: {
    fontSize: 13,
    color: colors.secondaryText,
    marginTop: 4,
    lineHeight: 18,
  },
  otpBanner: {
    backgroundColor: colors.customerTint,
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
    marginBottom: 14,
  },
  otpLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.primary,
    letterSpacing: 0.5,
  },
  otpNumber: {
    fontSize: 28,
    fontWeight: "900",
    color: colors.primary,
    letterSpacing: 4,
    marginTop: 2,
  },
  actions: {
    marginTop: 10,
  },
});
