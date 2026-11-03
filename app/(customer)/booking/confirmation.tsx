import React from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { colors } from "../../../src/theme/colors";
import Button from "../../../src/components/ui/Button";

export default function BookingConfirmationScreen() {
  const router = useRouter();
  const { bookingId } = useLocalSearchParams<{ bookingId: string }>();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.content}>
        <Text style={styles.icon}>🎉</Text>
        <Text style={styles.title}>Booking Requested!</Text>
        <Text style={styles.subtitle}>
          We are currently notifying nearby mini-truck drivers in Coimbatore.
        </Text>

        <View style={styles.infoCard}>
          <Text style={styles.infoLabel}>BOOKING ID</Text>
          <Text style={styles.infoValue}>{bookingId || "CARRY-" + Math.floor(100000 + Math.random() * 900000)}</Text>
          <Text style={[styles.infoLabel, { marginTop: 12 }]}>SEARCH STATUS</Text>
          <Text style={styles.searchingText}>Looking for nearest driver...</Text>
        </View>

        <Button
          title="Track Live Trip"
          size="large"
          onPress={() => {
            if (bookingId) {
              router.replace(`/(customer)/tracking/${bookingId}` as any);
            } else {
              router.replace("/(customer)/bookings");
            }
          }}
          style={styles.actionBtn}
        />

        <Button
          title="Back to Home"
          variant="outline"
          onPress={() => router.replace("/(customer)")}
          style={{ marginTop: 12 }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    fontSize: 64,
    marginBottom: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: colors.deepNavy,
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: colors.secondaryText,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 24,
  },
  infoCard: {
    width: "100%",
    backgroundColor: colors.background,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1.5,
    borderColor: colors.border,
    marginBottom: 24,
  },
  infoLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.secondaryText,
    letterSpacing: 0.5,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: "800",
    color: colors.deepNavy,
    marginTop: 2,
  },
  searchingText: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.primary,
    marginTop: 2,
  },
  actionBtn: {
    width: "100%",
  },
});
