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
import Input from "../../../src/components/ui/Input";
import RouteMap from "../../../src/components/maps/RouteMap";
import { bookingsService } from "../../../src/features/bookings/bookings.service";
import { Booking } from "../../../src/types/booking";

export default function DriverActiveTripScreen() {
  const router = useRouter();
  const { bookingId } = useLocalSearchParams<{ bookingId: string }>();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [enteredOtp, setEnteredOtp] = useState("");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (!bookingId) return;
    return bookingsService.listenBooking(bookingId, setBooking);
  }, [bookingId]);

  const handleNextMilestone = async () => {
    if (!booking) return;

    try {
      setUpdating(true);
      if (booking.status === "accepted") {
        await bookingsService.updateBookingStatus(booking.id, "arrived_pickup");
      } else if (booking.status === "arrived_pickup") {
        if (booking.pickupOtp && enteredOtp.trim() !== booking.pickupOtp) {
          Alert.alert("Invalid OTP", "Please ask customer for the 4-digit pickup OTP.");
          return;
        }
        await bookingsService.updateBookingStatus(booking.id, "in_transit");
        setEnteredOtp("");
      } else if (booking.status === "in_transit") {
        await bookingsService.updateBookingStatus(booking.id, "completed");
        Alert.alert("Trip Completed", "Delivery marked as complete. Collect fare if COD.");
        router.replace("/(driver)");
      }
    } catch (err: any) {
      Alert.alert("Update Error", err?.message || "Failed to update trip milestone.");
    } finally {
      setUpdating(false);
    }
  };

  const getButtonTitle = () => {
    if (booking?.status === "accepted") return "I have Arrived at Pickup";
    if (booking?.status === "arrived_pickup") return "Verify OTP & Start Trip";
    if (booking?.status === "in_transit") return "Complete Delivery & Collect Fare";
    return "Trip Completed";
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <Text style={styles.badge}>ACTIVE TRIP IN PROGRESS</Text>
          <Text style={styles.fare}>₹{booking ? Math.round(booking.fare.totalFarePaise / 100) : 0}</Text>
        </View>

        <RouteMap pickup={booking?.pickup} dropoff={booking?.dropoff} style={{ height: 240 }} />

        <View style={styles.infoCard}>
          <Text style={styles.sectionTitle}>
            {booking?.status === "in_transit" ? "En Route to Destination" : "Pickup Point"}
          </Text>
          <Text style={styles.address}>
            {booking?.status === "in_transit"
              ? booking?.dropoff.address
              : booking?.pickup.address}
          </Text>
        </View>

        {booking?.status === "arrived_pickup" ? (
          <View style={styles.otpBox}>
            <Text style={styles.otpTitle}>Customer Pickup OTP</Text>
            <Input
              placeholder="Enter 4-digit code"
              value={enteredOtp}
              onChangeText={setEnteredOtp}
              keyboardType="numeric"
              maxLength={4}
            />
          </View>
        ) : null}

        <Button
          title={getButtonTitle()}
          size="large"
          loading={updating}
          onPress={handleNextMilestone}
          style={{ marginTop: 16 }}
        />

        <Button
          title="Turn-by-turn Navigation"
          variant="outline"
          onPress={() => router.push("/(driver)/navigation")}
          style={{ marginTop: 10 }}
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  badge: {
    fontSize: 11,
    fontWeight: "800",
    color: colors.primary,
    letterSpacing: 0.5,
  },
  fare: {
    fontSize: 22,
    fontWeight: "900",
    color: colors.deepNavy,
  },
  infoCard: {
    backgroundColor: colors.surface,
    padding: 18,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: colors.border,
    marginVertical: 12,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.secondaryText,
    textTransform: "uppercase",
    marginBottom: 6,
  },
  address: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.deepNavy,
    lineHeight: 22,
  },
  otpBox: {
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: colors.border,
    marginBottom: 10,
  },
  otpTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.deepNavy,
    marginBottom: 8,
  },
});
