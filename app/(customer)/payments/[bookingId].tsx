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
import { bookingsService } from "../../../src/features/bookings/bookings.service";
import { paymentsService } from "../../../src/features/payments/payments.service";
import { Booking } from "../../../src/types/booking";

export default function CustomerPaymentScreen() {
  const router = useRouter();
  const { bookingId } = useLocalSearchParams<{ bookingId: string }>();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (!bookingId) return;
    return bookingsService.listenBooking(bookingId, setBooking);
  }, [bookingId]);

  const handlePayNow = async () => {
    if (!booking) return;
    try {
      setProcessing(true);
      await paymentsService.confirmPayment("simulated_pay_id", booking.id);
      Alert.alert("Success", "Payment marked as completed!");
      router.back();
    } catch (err: any) {
      Alert.alert("Error", err?.message || "Payment update failed.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.card}>
          <Text style={styles.header}>Payment Summary</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Trip Fare</Text>
            <Text style={styles.amount}>
              ₹{booking ? Math.round(booking.fare.totalFarePaise / 100) : 0}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Payment Method</Text>
            <Text style={styles.value}>{(booking?.paymentMethod || "cash").toUpperCase()}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Status</Text>
            <Text
              style={[
                styles.value,
                { color: booking?.paymentStatus === "paid" ? colors.success : colors.warning },
              ]}
            >
              {booking?.paymentStatus.toUpperCase()}
            </Text>
          </View>
        </View>

        {booking?.paymentStatus !== "paid" ? (
          <Button
            title="Complete Payment via UPI / Card"
            size="large"
            loading={processing}
            onPress={handlePayNow}
            style={{ marginTop: 20 }}
          />
        ) : (
          <View style={styles.paidBadge}>
            <Text style={styles.paidText}>✓ Payment Complete</Text>
          </View>
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
    flexGrow: 1,
  },
  card: {
    backgroundColor: colors.surface,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  header: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.deepNavy,
    marginBottom: 16,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 6,
  },
  label: {
    fontSize: 14,
    color: colors.secondaryText,
  },
  value: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.deepNavy,
  },
  amount: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.deepNavy,
  },
  paidBadge: {
    marginTop: 20,
    backgroundColor: "#E6F7F0",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  paidText: {
    color: colors.success,
    fontWeight: "700",
    fontSize: 16,
  },
});
