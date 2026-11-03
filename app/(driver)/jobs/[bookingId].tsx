import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { colors } from "../../../src/theme/colors";
import Button from "../../../src/components/ui/Button";
import RouteMap from "../../../src/components/maps/RouteMap";
import { bookingsService } from "../../../src/features/bookings/bookings.service";
import { useAuth } from "../../../src/hooks/useAuth";
import { Booking } from "../../../src/types/booking";

export default function DriverJobDetailScreen() {
  const router = useRouter();
  const { bookingId } = useLocalSearchParams<{ bookingId: string }>();
  const { user } = useAuth();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [accepting, setAccepting] = useState(false);

  useEffect(() => {
    if (!bookingId) return;
    return bookingsService.listenBooking(bookingId, setBooking);
  }, [bookingId]);

  const handleAcceptJob = async () => {
    if (!booking || !user) return;
    try {
      setAccepting(true);
      await bookingsService.updateBookingStatus(booking.id, "accepted");
      router.replace(`/(driver)/active-trip/${booking.id}` as any);
    } catch (err: any) {
      Alert.alert("Error", err?.message || "Could not accept trip.");
    } finally {
      setAccepting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.fareBanner}>
          <Text style={styles.fareLabel}>ESTIMATED EARNINGS</Text>
          <Text style={styles.fareValue}>
            ₹{booking ? Math.round(booking.fare.totalFarePaise / 100) : 0}
          </Text>
          <Text style={styles.vehicleTag}>{booking?.vehicleCategory.toUpperCase()}</Text>
        </View>

        <RouteMap
          pickup={booking?.pickup}
          dropoff={booking?.dropoff}
        />

        <View style={styles.detailsCard}>
          <Text style={styles.sectionTitle}>Pickup & Cargo Details</Text>
          <Text style={styles.label}>PICKUP POINT</Text>
          <Text style={styles.value}>{booking?.pickup.address}</Text>

          <Text style={[styles.label, { marginTop: 10 }]}>DELIVERY DESTINATION</Text>
          <Text style={styles.value}>{booking?.dropoff.address}</Text>

          <Text style={[styles.label, { marginTop: 10 }]}>CARGO COMMODITY</Text>
          <Text style={styles.value}>{booking?.cargo.category || "General Cargo"}</Text>

          <Text style={[styles.label, { marginTop: 10 }]}>HELPERS REQUESTED</Text>
          <Text style={styles.value}>{booking?.helpersCount || 0} Helper(s)</Text>
        </View>

        <Button
          title="Accept Trip & Navigate →"
          size="large"
          loading={accepting}
          onPress={handleAcceptJob}
          style={{ marginTop: 16 }}
        />
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
  fareBanner: {
    backgroundColor: colors.surface,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: "center",
    marginBottom: 16,
  },
  fareLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.secondaryText,
    letterSpacing: 0.5,
  },
  fareValue: {
    fontSize: 32,
    fontWeight: "900",
    color: colors.success,
    marginTop: 4,
  },
  vehicleTag: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.primary,
    backgroundColor: colors.customerTint,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginTop: 6,
  },
  detailsCard: {
    backgroundColor: colors.surface,
    padding: 18,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: colors.border,
    marginVertical: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: colors.deepNavy,
    marginBottom: 12,
  },
  label: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.secondaryText,
    letterSpacing: 0.5,
  },
  value: {
    fontSize: 14,
    color: colors.deepNavy,
    fontWeight: "600",
    marginTop: 2,
  },
});
