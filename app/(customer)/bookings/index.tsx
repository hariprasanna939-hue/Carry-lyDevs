import React from "react";
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { colors } from "../../../src/theme/colors";
import { useAuth } from "../../../src/hooks/useAuth";
import { useBookings } from "../../../src/hooks/useBookings";
import EmptyState from "../../../src/components/ui/EmptyState";
import { BOOKING_STATUS_LABELS } from "../../../src/constants/booking-status";
import Badge from "../../../src/components/ui/Badge";

export default function CustomerBookingsListScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { bookings, loading } = useBookings(user?.uid, "customer");

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={bookings}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          !loading ? (
            <EmptyState
              title="No Bookings Yet"
              description="You have not requested any mini-truck bookings. Book your first vehicle now!"
              actionTitle="Book Now"
              onAction={() => router.push("/(customer)/booking/location")}
            />
          ) : undefined
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.8}
            onPress={() => router.push(`/(customer)/bookings/${item.id}` as any)}
          >
            <View style={styles.cardHeader}>
              <Text style={styles.vehicleType}>{item.vehicleCategory.toUpperCase()}</Text>
              <Badge
                label={BOOKING_STATUS_LABELS[item.status] || item.status}
                variant={item.status === "completed" ? "success" : "primary"}
              />
            </View>
            <Text style={styles.addressText} numberOfLines={1}>
              📍 From: {item.pickup.address}
            </Text>
            <Text style={styles.addressText} numberOfLines={1}>
              🏁 To: {item.dropoff.address}
            </Text>
            <View style={styles.cardFooter}>
              <Text style={styles.fare}>₹{Math.round(item.fare.totalFarePaise / 100)}</Text>
              <Text style={styles.viewLink}>View details →</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  list: {
    padding: 20,
    flexGrow: 1,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  vehicleType: {
    fontSize: 14,
    fontWeight: "800",
    color: colors.deepNavy,
  },
  addressText: {
    fontSize: 13,
    color: colors.secondaryText,
    marginVertical: 2,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  fare: {
    fontSize: 16,
    fontWeight: "800",
    color: colors.deepNavy,
  },
  viewLink: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.primary,
  },
});
