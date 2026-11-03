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
import { colors } from "../../src/theme/colors";
import { useAuth } from "../../src/hooks/useAuth";
import { useBookings } from "../../src/hooks/useBookings";
import EmptyState from "../../src/components/ui/EmptyState";
import { formatDate } from "../../src/utils/date";

export default function CustomerHistoryScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { bookings, loading } = useBookings(user?.uid, "customer");

  const completedTrips = bookings.filter(
    (b) => b.status === "completed" || b.status === "cancelled"
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={completedTrips}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          !loading ? (
            <EmptyState
              title="No Past Trips"
              description="Your completed and cancelled trips will show up here."
            />
          ) : undefined
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.8}
            onPress={() => router.push(`/(customer)/bookings/${item.id}` as any)}
          >
            <View style={styles.header}>
              <Text style={styles.title}>{item.vehicleCategory.toUpperCase()}</Text>
              <Text style={styles.fare}>₹{Math.round(item.fare.totalFarePaise / 100)}</Text>
            </View>
            <Text style={styles.date}>{formatDate(item.createdAt as any)}</Text>
            <Text style={styles.address} numberOfLines={1}>
              To: {item.dropoff.address}
            </Text>
            <Text
              style={[
                styles.status,
                { color: item.status === "completed" ? colors.success : colors.danger },
              ]}
            >
              {item.status.toUpperCase()}
            </Text>
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
    padding: 16,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: colors.border,
    marginBottom: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  title: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.deepNavy,
  },
  fare: {
    fontSize: 15,
    fontWeight: "800",
    color: colors.deepNavy,
  },
  date: {
    fontSize: 12,
    color: colors.secondaryText,
    marginBottom: 6,
  },
  address: {
    fontSize: 13,
    color: colors.text,
  },
  status: {
    fontSize: 11,
    fontWeight: "700",
    marginTop: 8,
  },
});
