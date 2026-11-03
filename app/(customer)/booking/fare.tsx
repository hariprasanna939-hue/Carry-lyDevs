import React, { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { colors } from "../../../src/theme/colors";
import Button from "../../../src/components/ui/Button";
import { bookingStore } from "../../../src/store/booking.store";
import { pricingService } from "../../../src/features/pricing/pricing.service";
import { bookingsService } from "../../../src/features/bookings/bookings.service";
import { useAuth } from "../../../src/hooks/useAuth";
import FareSummary from "../../../src/components/booking/FareSummary";

export default function BookingFareScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const draft = bookingStore.getDraft();

  const [paymentMethod, setPaymentMethod] = useState<"cash" | "upi" | "card">(
    draft.paymentMethod || "cash"
  );
  const [loading, setLoading] = useState(false);

  const fare = pricingService.calculateFare({
    vehicleId: draft.vehicleCategoryId || "tata_ace",
    distanceKm: draft.estimatedDistanceKm || 5,
    helpersCount: draft.helpersCount || 0,
  });

  const handleConfirm = async () => {
    try {
      setLoading(true);
      const bookingId = await bookingsService.createBooking({
        customerId: user?.uid || "guest_customer",
        status: "searching",
        pickup: draft.pickup || {
          address: "Gandhipuram, Coimbatore",
          latitude: 11.0168,
          longitude: 76.9558,
        },
        dropoff: draft.dropoff || {
          address: "Peelamedu, Coimbatore",
          latitude: 11.0285,
          longitude: 77.0275,
        },
        vehicleCategory: draft.vehicleCategoryId || "tata_ace",
        cargo: draft.cargo || { category: "General Goods" },
        helpersCount: draft.helpersCount || 0,
        isInstant: draft.isInstant,
        scheduledTime: draft.scheduledTime || undefined,
        fare,
        paymentMethod,
        paymentStatus: "pending",
      });

      bookingStore.resetDraft();
      router.replace(`/(customer)/booking/confirmation?bookingId=${bookingId}` as any);
    } catch (err: any) {
      Alert.alert("Booking Error", err?.message || "Failed to confirm booking.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Confirm & Book</Text>
        <Text style={styles.subtitle}>Review fare quote and choose payment option</Text>

        <FareSummary fare={fare} distanceKm={draft.estimatedDistanceKm || 5} />

        <View style={styles.paymentSection}>
          <Text style={styles.sectionTitle}>Payment Method</Text>

          <TouchableOpacity
            style={[styles.payCard, paymentMethod === "cash" && styles.payCardActive]}
            onPress={() => setPaymentMethod("cash")}
          >
            <Text style={styles.payIcon}>💵</Text>
            <View style={styles.payInfo}>
              <Text style={styles.payTitle}>Cash on Delivery</Text>
              <Text style={styles.paySubtitle}>Pay directly to driver after delivery</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.payCard, paymentMethod === "upi" && styles.payCardActive]}
            onPress={() => setPaymentMethod("upi")}
          >
            <Text style={styles.payIcon}>📱</Text>
            <View style={styles.payInfo}>
              <Text style={styles.payTitle}>UPI / GPay / PhonePe</Text>
              <Text style={styles.paySubtitle}>Instant UPI transfer upon trip start/finish</Text>
            </View>
          </TouchableOpacity>
        </View>

        <Button
          title={`Confirm Booking • ₹${Math.round(fare.totalFarePaise / 100)}`}
          size="large"
          loading={loading}
          onPress={handleConfirm}
          style={{ marginTop: 20 }}
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
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: colors.deepNavy,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: colors.secondaryText,
    marginBottom: 16,
  },
  paymentSection: {
    marginTop: 12,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.deepNavy,
    marginBottom: 12,
  },
  payCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: colors.border,
    marginBottom: 10,
  },
  payCardActive: {
    borderColor: colors.primary,
    backgroundColor: colors.customerTint,
  },
  payIcon: {
    fontSize: 26,
    marginRight: 14,
  },
  payInfo: {
    flex: 1,
  },
  payTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.deepNavy,
  },
  paySubtitle: {
    fontSize: 12,
    color: colors.secondaryText,
    marginTop: 2,
  },
});
