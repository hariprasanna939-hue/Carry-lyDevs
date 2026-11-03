import React from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { colors } from "../../src/theme/colors";
import Button from "../../src/components/ui/Button";
import { useAuth } from "../../src/hooks/useAuth";
import { useBookings } from "../../src/hooks/useBookings";
import { COIMBATORE_VEHICLE_CATEGORIES } from "../../src/constants/vehicles";
import ActiveTripCard from "../../src/components/customer/ActiveTripCard";

export default function CustomerHomeScreen() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { bookings } = useBookings(user?.uid, "customer");

  const activeTrip = bookings.find(
    (b) => b.status !== "completed" && b.status !== "cancelled"
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Top Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.brand}>CARRY</Text>
            <Text style={styles.locationTag}>📍 Coimbatore, TN</Text>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity
              onPress={() => router.push("/(shared)/notifications")}
              style={styles.iconBtn}
            >
              <Text style={{ fontSize: 18 }}>🔔</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                if (!isAuthenticated) {
                  router.push("/(auth)/login");
                } else {
                  router.push("/(customer)/profile");
                }
              }}
              style={styles.avatarBtn}
            >
              <Text style={{ fontSize: 18 }}>👤</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Active Booking Banner if any */}
        {activeTrip ? (
          <View style={styles.activeTripSection}>
            <Text style={styles.sectionTitle}>Active Trip</Text>
            <ActiveTripCard
              booking={activeTrip}
              onPress={() => router.push(`/(customer)/tracking/${activeTrip.id}` as any)}
            />
          </View>
        ) : null}

        {/* Quick Booking CTA Banner */}
        <View style={styles.heroCard}>
          <Text style={styles.heroTitle}>Book Mini-Truck Instantly</Text>
          <Text style={styles.heroSubtitle}>
            Fast pickup across Gandhipuram, RS Puram, Peelamedu, and SIDCO.
          </Text>
          <Button
            title="Book a Delivery Now →"
            size="large"
            onPress={() => router.push("/(customer)/booking/location")}
            style={styles.heroButton}
          />
        </View>

        {/* Vehicle Fleet Preview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Available Fleet in Coimbatore</Text>
          {COIMBATORE_VEHICLE_CATEGORIES.map((v) => (
            <TouchableOpacity
              key={v.id}
              style={styles.fleetItem}
              activeOpacity={0.7}
              onPress={() => router.push("/(customer)/booking/location")}
            >
              <Text style={styles.fleetIcon}>{v.icon}</Text>
              <View style={styles.fleetInfo}>
                <Text style={styles.fleetName}>{v.name}</Text>
                <Text style={styles.fleetTagline}>{v.tagline}</Text>
                <Text style={styles.fleetCap}>Capacity: {v.capacityKg} kg</Text>
              </View>
              <Text style={styles.fleetFare}>From ₹{Math.round(v.baseFarePaise / 100)}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Quick Links Menu */}
        <View style={styles.grid}>
          <TouchableOpacity
            style={styles.gridItem}
            onPress={() => router.push("/(customer)/bookings")}
          >
            <Text style={styles.gridIcon}>📋</Text>
            <Text style={styles.gridLabel}>My Bookings</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.gridItem}
            onPress={() => router.push("/(customer)/addresses")}
          >
            <Text style={styles.gridIcon}>⭐</Text>
            <Text style={styles.gridLabel}>Saved Places</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.gridItem}
            onPress={() => router.push("/(auth)/choose-portal")}
          >
            <Text style={styles.gridIcon}>🔄</Text>
            <Text style={styles.gridLabel}>Switch Portal</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.gridItem}
            onPress={() => router.push("/(shared)/support")}
          >
            <Text style={styles.gridIcon}>💬</Text>
            <Text style={styles.gridLabel}>Support</Text>
          </TouchableOpacity>
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  brand: {
    fontSize: 26,
    fontWeight: "900",
    color: colors.primary,
  },
  locationTag: {
    fontSize: 12,
    color: colors.secondaryText,
    marginTop: 2,
    fontWeight: "600",
  },
  headerRight: {
    flexDirection: "row",
    gap: 10,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  avatarBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  activeTripSection: {
    marginBottom: 16,
  },
  heroCard: {
    backgroundColor: colors.primary,
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#FFFFFF",
    marginBottom: 6,
  },
  heroSubtitle: {
    fontSize: 14,
    color: "#E0E7FF",
    lineHeight: 20,
    marginBottom: 18,
  },
  heroButton: {
    backgroundColor: "#FFFFFF",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: colors.deepNavy,
    marginBottom: 12,
  },
  fleetItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    padding: 14,
    borderRadius: 14,
    marginBottom: 10,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  fleetIcon: {
    fontSize: 28,
    marginRight: 12,
  },
  fleetInfo: {
    flex: 1,
  },
  fleetName: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.deepNavy,
  },
  fleetTagline: {
    fontSize: 12,
    color: colors.secondaryText,
    marginTop: 1,
  },
  fleetCap: {
    fontSize: 11,
    color: colors.primary,
    fontWeight: "600",
    marginTop: 3,
  },
  fleetFare: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.deepNavy,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  gridItem: {
    width: "48%",
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  gridIcon: {
    fontSize: 24,
    marginBottom: 6,
  },
  gridLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.deepNavy,
  },
});
