import React, { useState } from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  ArrowRight,
  Calendar,
  CheckCircle2,
  Clock,
  Compass,
  MapPin,
  Package,
  Truck,
} from "lucide-react-native";
import { CarryButton, CarryCard, CarryStatusTag } from "../../components/CarryUI";
import { CarryVehicleArt } from "../../components/CarryVehicleArt";
import CustomerTrackingModal from "./CustomerTrackingModal";
import { colors } from "../../theme/colors";

interface BookingItem {
  id: string;
  type: "ongoing" | "upcoming" | "completed";
  pickup: string;
  drop: string;
  vehicleName: string;
  vehicleCategory: "mini" | "small" | "medium" | "large";
  date: string;
  time: string;
  totalFare: string;
  status: string;
  helperCount: number;
}

const SAMPLE_BOOKINGS: BookingItem[] = [
  {
    id: "CRY-84920",
    type: "ongoing",
    pickup: "Gandhipuram Cross Cut Road, Coimbatore",
    drop: "Peelamedu, Near PSG Tech, Coimbatore",
    vehicleName: "Mini Truck (Tata Ace)",
    vehicleCategory: "mini",
    date: "Today",
    time: "4:15 PM",
    totalFare: "₹480",
    status: "Driver Reaching Pickup",
    helperCount: 1,
  },
  {
    id: "CRY-82194",
    type: "upcoming",
    pickup: "RS Puram West, Coimbatore",
    drop: "Saravanampatti Tech Park, Coimbatore",
    vehicleName: "Bolero Pickup",
    vehicleCategory: "small",
    date: "Tomorrow",
    time: "10:00 AM",
    totalFare: "₹650",
    status: "Scheduled",
    helperCount: 2,
  },
  {
    id: "CRY-79102",
    type: "completed",
    pickup: "Singanallur Trichy Road, Coimbatore",
    drop: "Ganapathy Bus Stop, Coimbatore",
    vehicleName: "Medium Truck (Tata 407)",
    vehicleCategory: "medium",
    date: "2 Nov 2026",
    time: "2:30 PM",
    totalFare: "₹890",
    status: "Completed",
    helperCount: 1,
  },
];

export default function CustomerBookingsScreen() {
  const [activeTab, setActiveTab] = useState<"ongoing" | "upcoming" | "completed">("ongoing");
  const [bookingsList, setBookingsList] = useState<BookingItem[]>(SAMPLE_BOOKINGS);
  const [selectedBooking, setSelectedBooking] = useState<BookingItem | null>(null);

  const filtered = bookingsList.filter((b) => b.type === activeTab);

  const handleCancelBooking = (bookingId: string) => {
    setBookingsList((prev) => prev.filter((b) => b.id !== bookingId));
  };

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={styles.header}>
        <Text style={styles.pageTitle}>My Moves</Text>
        <Text style={styles.pageSub}>Track active and previous Coimbatore trips</Text>
      </View>

      {/* Segmented Filter Tabs */}
      <View style={styles.tabsRow}>
        {[
          { key: "ongoing", label: "Ongoing" },
          { key: "upcoming", label: "Upcoming" },
          { key: "completed", label: "Completed" },
        ].map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <Pressable
              key={tab.key}
              onPress={() => setActiveTab(tab.key as any)}
              style={[styles.tabButton, isActive && styles.tabButtonActive]}
            >
              <Text
                style={[
                  styles.tabButtonText,
                  isActive && styles.tabButtonTextActive,
                ]}
              >
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* List */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconCircle}>
              <Package size={28} color={colors.secondaryText} />
            </View>
            <Text style={styles.emptyTitle}>No {activeTab} moves</Text>
            <Text style={styles.emptySub}>
              When you book or schedule a move in Coimbatore, it will appear here.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <CarryCard
            onPress={() => setSelectedBooking(item)}
            style={styles.bookingCard}
          >
            <View style={styles.cardTop}>
              <View style={styles.bookingIdRow}>
                <Text style={styles.bookingId}>{item.id}</Text>
                <Text style={styles.bookingTime}>
                  {item.date} • {item.time}
                </Text>
              </View>

              <CarryStatusTag
                tone={
                  item.type === "ongoing"
                    ? "solid"
                    : item.type === "upcoming"
                    ? "outline"
                    : "muted"
                }
              >
                {item.status}
              </CarryStatusTag>
            </View>

            <View style={styles.routeBox}>
              <View style={styles.routeRow}>
                <View style={styles.pinDot} />
                <Text style={styles.routeText} numberOfLines={1}>
                  {item.pickup}
                </Text>
              </View>
              <View style={styles.routeConnector} />
              <View style={styles.routeRow}>
                <View style={[styles.pinDot, styles.pinSquare]} />
                <Text style={styles.routeText} numberOfLines={1}>
                  {item.drop}
                </Text>
              </View>
            </View>

            <View style={styles.cardBottom}>
              <View style={styles.vehicleArtRow}>
                <CarryVehicleArt type={item.vehicleCategory} width={65} />
                <Text style={styles.vehicleLabel}>
                  {item.vehicleName}
                  {item.helperCount > 0 ? ` • ${item.helperCount} Helper` : ""}
                </Text>
              </View>

              <View style={styles.fareActionCol}>
                <Text style={styles.fareAmount}>{item.totalFare}</Text>
                <Pressable
                  onPress={() => setSelectedBooking(item)}
                  style={styles.detailsBtn}
                >
                  <Text style={styles.detailsText}>
                    {item.type === "ongoing" ? "Track Move" : "Details"}
                  </Text>
                  <ArrowRight size={13} color={colors.primaryBlack} />
                </Pressable>
              </View>
            </View>
          </CarryCard>
        )}
      />

      {/* Tracking Modal */}
      {selectedBooking && (
        <CustomerTrackingModal
          visible={!!selectedBooking}
          onClose={() => setSelectedBooking(null)}
          booking={selectedBooking}
          onCancelBooking={handleCancelBooking}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
    backgroundColor: colors.cardSurface,
  },
  pageTitle: {
    fontSize: 26,
    fontWeight: "900",
    color: colors.primaryBlack,
    letterSpacing: -0.8,
  },
  pageSub: {
    fontSize: 13,
    color: colors.secondaryText,
    marginTop: 4,
  },
  tabsRow: {
    flexDirection: "row",
    backgroundColor: colors.lightGrey,
    marginHorizontal: 20,
    marginVertical: 14,
    borderRadius: 12,
    padding: 3,
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 9,
    borderRadius: 10,
  },
  tabButtonActive: {
    backgroundColor: colors.primaryBlack,
  },
  tabButtonText: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.secondaryText,
  },
  tabButtonTextActive: {
    color: colors.white,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 32,
    gap: 14,
  },
  bookingCard: {
    padding: 16,
    gap: 12,
  },
  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  bookingIdRow: {},
  bookingId: {
    fontSize: 15,
    fontWeight: "900",
    color: colors.primaryBlack,
    letterSpacing: -0.2,
  },
  bookingTime: {
    fontSize: 12,
    color: colors.secondaryText,
    marginTop: 2,
  },
  routeBox: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 12,
  },
  routeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  pinDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primaryBlack,
  },
  pinSquare: {
    borderRadius: 2,
  },
  routeText: {
    flex: 1,
    fontSize: 13,
    fontWeight: "600",
    color: colors.mainText,
  },
  routeConnector: {
    width: 2,
    height: 10,
    backgroundColor: colors.borderGrey,
    marginLeft: 4,
    marginVertical: 2,
  },
  cardBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: colors.borderGrey,
    paddingTop: 10,
  },
  vehicleArtRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  vehicleLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.mainText,
  },
  fareActionCol: {
    alignItems: "flex-end",
  },
  fareAmount: {
    fontSize: 18,
    fontWeight: "900",
    color: colors.primaryBlack,
  },
  detailsBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 2,
  },
  detailsText: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.primaryBlack,
    textDecorationLine: "underline",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    paddingHorizontal: 24,
  },
  emptyIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.lightGrey,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: colors.primaryBlack,
  },
  emptySub: {
    fontSize: 13,
    color: colors.secondaryText,
    textAlign: "center",
    marginTop: 6,
    lineHeight: 18,
  },
});
