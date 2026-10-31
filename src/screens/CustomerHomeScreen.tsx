import React, { useState } from "react";
import {
  Alert,
  Image,
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useCarryAuth } from "../auth/AuthContext";
import CarryBadge from "../components/CarryBadge";
import CarryButton from "../components/CarryButton";
import CarryCard from "../components/CarryCard";
import CarryEmptyState from "../components/CarryEmptyState";
import {
  COIMBATORE_VEHICLE_CATEGORIES,
  VehicleCategory,
} from "../constants/vehicles";
import { colors } from "../theme/colors";
import { formatPaiseToINR } from "../utils/currency";

interface Props {
  onSwitchPortal: () => void;
  onOpenAuth?: () => void;
}

type TabType = "home" | "bookings" | "notifications" | "profile";
type BookingMode = "instant" | "schedule";
type HelperOption = 0 | 1 | 2;

export default function CustomerHomeScreen({
  onSwitchPortal,
  onOpenAuth,
}: Props) {
  const { profile, logout } = useCarryAuth();

  // Tab State
  const [activeTab, setActiveTab] = useState<TabType>("home");

  // Home Screen Interactive Booking State
  const [bookingMode, setBookingMode] = useState<BookingMode>("instant");
  const [scheduleTime, setScheduleTime] = useState("Today, in 2 hours");
  const [pickupAddress, setPickupAddress] = useState("");
  const [dropAddress, setDropAddress] = useState("");
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleCategory>(
    COIMBATORE_VEHICLE_CATEGORIES[1] // Default: Tata Ace / Mini Truck
  );
  const [helperCount, setHelperCount] = useState<HelperOption>(1); // Default: 1 helper
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [itemDescription, setItemDescription] = useState("");

  // Helper fee calculation (paise)
  const helperFeePaise =
    helperCount === 1 ? 20000 : helperCount === 2 ? 40000 : 0;
  const estimatedFarePaise = selectedVehicle.baseFarePaise + helperFeePaise;

  const quickLocations = [
    "Gandhipuram",
    "Peelamedu",
    "Saravanampatti",
    "Singanallur",
    "RS Puram",
  ];

  const handleSelectQuickLocation = (loc: string) => {
    if (!pickupAddress) {
      setPickupAddress(`${loc}, Coimbatore`);
    } else if (!dropAddress) {
      setDropAddress(`${loc}, Coimbatore`);
    } else {
      setDropAddress(`${loc}, Coimbatore`);
    }
  };

  const handleProceedBooking = () => {
    if (!pickupAddress.trim()) {
      Alert.alert(
        "Pickup Required",
        "Please enter a pickup location in Coimbatore."
      );
      return;
    }
    if (!dropAddress.trim()) {
      Alert.alert(
        "Drop Required",
        "Please enter a drop destination in Coimbatore."
      );
      return;
    }
    setShowConfirmationModal(true);
  };

  const handleConfirmOrder = () => {
    setShowConfirmationModal(false);
    Alert.alert(
      "Booking Request Received",
      `Your request for a ${selectedVehicle.name} (${
        bookingMode === "instant" ? "Instant Dispatch" : scheduleTime
      }) from ${pickupAddress} to ${dropAddress} has been received. Live driver assignment will connect in the next phase!`,
      [{ text: "OK", onPress: () => setActiveTab("bookings") }]
    );
  };

  // Render Functions
  const renderHomeContent = () => (
    <ScrollView
      style={styles.scrollFlex}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      {/* 1. Header */}
      <View style={styles.header}>
        <View style={styles.brandRow}>
          <Image
            source={require("../../assets/logo.png")}
            style={styles.headerLogo}
            resizeMode="contain"
          />
          <View style={styles.cityPill}>
            <Text style={styles.cityPillText}>Coimbatore 📍</Text>
          </View>
        </View>

        <View style={styles.headerActions}>
          <Pressable
            style={styles.iconButton}
            onPress={() => setActiveTab("notifications")}
          >
            <Text style={styles.iconButtonEmoji}>🔔</Text>
            <View style={styles.notificationDot} />
          </Pressable>

          <Pressable
            style={styles.avatarButton}
            onPress={() => setActiveTab("profile")}
          >
            <Text style={styles.avatarEmoji}>👤</Text>
          </Pressable>
        </View>
      </View>

      {/* 2. Welcome Section */}
      <View style={styles.welcomeHero}>
        <Text style={styles.welcomeTitle}>Move anything, with CARRY.</Text>
        <Text style={styles.welcomeSubtitle}>
          Reliable goods transportation and mini-trucks at your fingertips.
        </Text>
      </View>

      {/* 4. Booking Options (Instant vs Schedule) */}
      <View style={styles.bookingTypeContainer}>
        <Pressable
          style={[
            styles.bookingTypeTab,
            bookingMode === "instant" && styles.bookingTypeTabActive,
          ]}
          onPress={() => setBookingMode("instant")}
        >
          <Text
            style={[
              styles.bookingTypeText,
              bookingMode === "instant" && styles.bookingTypeTextActive,
            ]}
          >
            ⚡ Instant Booking
          </Text>
        </Pressable>

        <Pressable
          style={[
            styles.bookingTypeTab,
            bookingMode === "schedule" && styles.bookingTypeTabActive,
          ]}
          onPress={() => {
            setBookingMode("schedule");
            Alert.alert(
              "Schedule Moving Time",
              "Select your preferred delivery slot for Coimbatore:",
              [
                {
                  text: "Today, 4:00 PM - 5:00 PM",
                  onPress: () => setScheduleTime("Today, 4:00 PM - 5:00 PM"),
                },
                {
                  text: "Tomorrow Morning (9:00 AM)",
                  onPress: () => setScheduleTime("Tomorrow, 9:00 AM - 10:00 AM"),
                },
                {
                  text: "Tomorrow Afternoon (2:00 PM)",
                  onPress: () => setScheduleTime("Tomorrow, 2:00 PM - 3:00 PM"),
                },
                { text: "Cancel", style: "cancel" },
              ]
            );
          }}
        >
          <Text
            style={[
              styles.bookingTypeText,
              bookingMode === "schedule" && styles.bookingTypeTextActive,
            ]}
          >
            📅 Schedule Booking
          </Text>
        </Pressable>
      </View>

      {bookingMode === "schedule" && (
        <View style={styles.scheduleBadgeRow}>
          <CarryBadge text={`Scheduled for: ${scheduleTime}`} variant="info" />
        </View>
      )}

      {/* 3. Location Section */}
      <CarryCard style={styles.locationCard}>
        <Text style={styles.sectionHeading}>Pickup & Drop in Coimbatore</Text>

        <View style={styles.inputRow}>
          <Text style={styles.locationPinGreen}>🟢</Text>
          <TextInput
            style={styles.locationInput}
            placeholder="Enter pickup location (e.g., Gandhipuram)"
            placeholderTextColor="#9A9EAB"
            value={pickupAddress}
            onChangeText={setPickupAddress}
          />
          {pickupAddress ? (
            <Pressable onPress={() => setPickupAddress("")}>
              <Text style={styles.clearText}>✕</Text>
            </Pressable>
          ) : null}
        </View>

        <View style={styles.routeDivider} />

        <View style={styles.inputRow}>
          <Text style={styles.locationPinRed}>🔴</Text>
          <TextInput
            style={styles.locationInput}
            placeholder="Enter drop destination (e.g., Peelamedu)"
            placeholderTextColor="#9A9EAB"
            value={dropAddress}
            onChangeText={setDropAddress}
          />
          {dropAddress ? (
            <Pressable onPress={() => setDropAddress("")}>
              <Text style={styles.clearText}>✕</Text>
            </Pressable>
          ) : null}
        </View>

        {/* Quick Chips */}
        <View style={styles.quickChipsContainer}>
          <Text style={styles.quickChipLabel}>Popular spots:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {quickLocations.map((loc) => (
              <Pressable
                key={loc}
                style={styles.quickChip}
                onPress={() => handleSelectQuickLocation(loc)}
              >
                <Text style={styles.quickChipText}>{loc}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      </CarryCard>

      {/* 5. Vehicle Categories */}
      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionTitle}>Choose Vehicle Category</Text>
        <CarryBadge text="Coimbatore Fleet" variant="neutral" />
      </View>

      <View style={styles.vehicleGrid}>
        {COIMBATORE_VEHICLE_CATEGORIES.map((vehicle) => {
          const isSelected = selectedVehicle.id === vehicle.id;
          return (
            <Pressable
              key={vehicle.id}
              style={[
                styles.vehicleCard,
                isSelected && styles.vehicleCardSelected,
              ]}
              onPress={() => setSelectedVehicle(vehicle)}
            >
              <View style={styles.vehicleTopRow}>
                <Text style={styles.vehicleIcon}>{vehicle.icon}</Text>
                <CarryBadge
                  text={`Max ${vehicle.capacityKg} kg`}
                  variant={isSelected ? "info" : "neutral"}
                />
              </View>

              <Text style={styles.vehicleName}>{vehicle.name}</Text>
              <Text style={styles.vehicleTagline}>{vehicle.tagline}</Text>

              <View style={styles.vehicleBottomRow}>
                <Text style={styles.vehicleDims}>{vehicle.dimensions}</Text>
                <Text style={styles.vehiclePrice}>
                  From {formatPaiseToINR(vehicle.baseFarePaise)}
                </Text>
              </View>

              {isSelected && <View style={styles.selectedIndicator} />}
            </Pressable>
          );
        })}
      </View>

      {/* 6. Helper Selection */}
      <Text style={styles.sectionTitle}>Loading & Unloading Helpers</Text>
      <View style={styles.helperOptionsRow}>
        <Pressable
          style={[
            styles.helperOptionCard,
            helperCount === 0 && styles.helperOptionCardSelected,
          ]}
          onPress={() => setHelperCount(0)}
        >
          <Text style={styles.helperIcon}>🧑‍✈️</Text>
          <Text style={styles.helperTitle}>Driver Only</Text>
          <Text style={styles.helperPrice}>Included</Text>
        </Pressable>

        <Pressable
          style={[
            styles.helperOptionCard,
            helperCount === 1 && styles.helperOptionCardSelected,
          ]}
          onPress={() => setHelperCount(1)}
        >
          <Text style={styles.helperIcon}>💪</Text>
          <Text style={styles.helperTitle}>Driver + 1</Text>
          <Text style={styles.helperPrice}>+₹200</Text>
        </Pressable>

        <Pressable
          style={[
            styles.helperOptionCard,
            helperCount === 2 && styles.helperOptionCardSelected,
          ]}
          onPress={() => setHelperCount(2)}
        >
          <Text style={styles.helperIcon}>👥</Text>
          <Text style={styles.helperTitle}>Driver + 2</Text>
          <Text style={styles.helperPrice}>+₹400</Text>
        </Pressable>
      </View>

      {/* Fare Estimate Action Card */}
      <CarryCard variant="primaryTint" style={styles.fareSummaryCard}>
        <View style={styles.fareRow}>
          <View>
            <Text style={styles.fareLabel}>Estimated Fare</Text>
            <Text style={styles.fareAmount}>
              {formatPaiseToINR(estimatedFarePaise)}
            </Text>
            <Text style={styles.fareSubtext}>
              Includes {selectedVehicle.name} base + {helperCount} helper(s)
            </Text>
          </View>
          <CarryButton
            title="Book Now"
            onPress={handleProceedBooking}
            style={styles.bookNowButton}
          />
        </View>
      </CarryCard>

      {/* 7. Recent Bookings (Empty State) */}
      <Text style={styles.sectionTitle}>Recent Bookings</Text>
      <CarryCard style={styles.recentBookingsCard}>
        <CarryEmptyState
          icon="📦"
          title="No recent bookings yet"
          description="When you book a vehicle, your active trips and completed deliveries in Coimbatore will appear right here."
          actionTitle="Book Your First Move"
          onAction={() => {
            if (!pickupAddress) setPickupAddress("Gandhipuram, Coimbatore");
            if (!dropAddress) setDropAddress("Peelamedu, Coimbatore");
          }}
        />
      </CarryCard>
    </ScrollView>
  );

  const renderBookingsTab = () => (
    <ScrollView
      style={styles.scrollFlex}
      contentContainerStyle={styles.scrollContent}
    >
      <Text style={styles.tabScreenTitle}>My Bookings</Text>
      <Text style={styles.tabScreenSubtitle}>
        Track active dispatches and view your completed move history.
      </Text>

      <CarryEmptyState
        icon="🚚"
        title="No active or past bookings"
        description="You have not created any bookings yet. Create your first booking from the Home tab."
        actionTitle="Go to Home"
        onAction={() => setActiveTab("home")}
      />
    </ScrollView>
  );

  const renderNotificationsTab = () => (
    <ScrollView
      style={styles.scrollFlex}
      contentContainerStyle={styles.scrollContent}
    >
      <Text style={styles.tabScreenTitle}>Notifications</Text>
      <Text style={styles.tabScreenSubtitle}>
        Important booking updates, driver arrivals, and offers.
      </Text>

      <CarryCard style={styles.notificationCard}>
        <Text style={styles.notificationIcon}>🎉</Text>
        <View style={styles.notificationTextContainer}>
          <Text style={styles.notificationHeading}>Welcome to CARRY!</Text>
          <Text style={styles.notificationBody}>
            Goods transportation and mini-truck bookings are now live across
            Coimbatore, Tamil Nadu.
          </Text>
          <Text style={styles.notificationTimestamp}>Just now</Text>
        </View>
      </CarryCard>
    </ScrollView>
  );

  const renderProfileTab = () => (
    <ScrollView
      style={styles.scrollFlex}
      contentContainerStyle={styles.scrollContent}
    >
      <Text style={styles.tabScreenTitle}>My Account</Text>

      {profile ? (
        <CarryCard style={styles.profileCard}>
          <View style={styles.profileHeaderRow}>
            <View style={styles.avatarLarge}>
              <Text style={styles.avatarLargeText}>
                {profile.fullName.charAt(0).toUpperCase()}
              </Text>
            </View>
            <View>
              <Text style={styles.profileName}>{profile.fullName}</Text>
              <Text style={styles.profileEmail}>{profile.email}</Text>
              <Text style={styles.profilePhone}>{profile.phone}</Text>
            </View>
          </View>

          <View style={styles.badgeRow}>
            <CarryBadge text="Customer Account" variant="info" />
            <View style={styles.spacerBadge} />
            <CarryBadge
              text={`Driver Status: ${profile.driverVerificationStatus}`}
              variant={
                profile.driverVerificationStatus === "approved"
                  ? "success"
                  : profile.driverVerificationStatus === "pending"
                  ? "warning"
                  : "neutral"
              }
            />
          </View>
        </CarryCard>
      ) : (
        <CarryCard style={styles.profileCard}>
          <Text style={styles.guestTitle}>Guest Customer</Text>
          <Text style={styles.guestSubtitle}>
            Sign in to track your moves, save frequent addresses, and manage your
            account.
          </Text>
          {onOpenAuth && (
            <CarryButton title="Sign In / Register" onPress={onOpenAuth} />
          )}
        </CarryCard>
      )}

      <Text style={styles.sectionTitle}>Portals & Operations</Text>

      <CarryCard onPress={onSwitchPortal} style={styles.actionCard}>
        <View style={styles.actionCardRow}>
          <Text style={styles.actionIcon}>🔄</Text>
          <View style={styles.actionTextWrapper}>
            <Text style={styles.actionTitle}>Switch Portal</Text>
            <Text style={styles.actionDesc}>
              Switch between Customer and Driver modes or apply as a driver.
            </Text>
          </View>
          <Text style={styles.chevron}>→</Text>
        </View>
      </CarryCard>

      <CarryCard style={styles.actionCard}>
        <View style={styles.actionCardRow}>
          <Text style={styles.actionIcon}>📍</Text>
          <View style={styles.actionTextWrapper}>
            <Text style={styles.actionTitle}>Service Area</Text>
            <Text style={styles.actionDesc}>
              Coimbatore District, Tamil Nadu (35 km coverage radius).
            </Text>
          </View>
        </View>
      </CarryCard>

      {profile && (
        <View style={styles.logoutWrapper}>
          <CarryButton title="Sign Out" onPress={logout} secondary />
        </View>
      )}
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.safeContainer}>
      {/* Content Area */}
      {activeTab === "home" && renderHomeContent()}
      {activeTab === "bookings" && renderBookingsTab()}
      {activeTab === "notifications" && renderNotificationsTab()}
      {activeTab === "profile" && renderProfileTab()}

      {/* 8. Bottom Navigation */}
      <View style={styles.bottomNav}>
        <Pressable
          style={styles.navItem}
          onPress={() => setActiveTab("home")}
        >
          <Text
            style={[
              styles.navIcon,
              activeTab === "home" && styles.navIconActive,
            ]}
          >
            🏠
          </Text>
          <Text
            style={[
              styles.navLabel,
              activeTab === "home" && styles.navLabelActive,
            ]}
          >
            Home
          </Text>
        </Pressable>

        <Pressable
          style={styles.navItem}
          onPress={() => setActiveTab("bookings")}
        >
          <Text
            style={[
              styles.navIcon,
              activeTab === "bookings" && styles.navIconActive,
            ]}
          >
            📦
          </Text>
          <Text
            style={[
              styles.navLabel,
              activeTab === "bookings" && styles.navLabelActive,
            ]}
          >
            My Bookings
          </Text>
        </Pressable>

        <Pressable
          style={styles.navItem}
          onPress={() => setActiveTab("notifications")}
        >
          <Text
            style={[
              styles.navIcon,
              activeTab === "notifications" && styles.navIconActive,
            ]}
          >
            🔔
          </Text>
          <Text
            style={[
              styles.navLabel,
              activeTab === "notifications" && styles.navLabelActive,
            ]}
          >
            Notifications
          </Text>
        </Pressable>

        <Pressable
          style={styles.navItem}
          onPress={() => setActiveTab("profile")}
        >
          <Text
            style={[
              styles.navIcon,
              activeTab === "profile" && styles.navIconActive,
            ]}
          >
            👤
          </Text>
          <Text
            style={[
              styles.navLabel,
              activeTab === "profile" && styles.navLabelActive,
            ]}
          >
            Profile
          </Text>
        </Pressable>
      </View>

      {/* Booking Review & Confirmation Modal */}
      <Modal
        visible={showConfirmationModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowConfirmationModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Confirm Move Details</Text>
              <Pressable onPress={() => setShowConfirmationModal(false)}>
                <Text style={styles.modalCloseText}>✕</Text>
              </Pressable>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.modalItem}>
                <Text style={styles.modalLabel}>Selected Vehicle</Text>
                <Text style={styles.modalValue}>
                  {selectedVehicle.name} ({selectedVehicle.dimensions})
                </Text>
              </View>

              <View style={styles.modalItem}>
                <Text style={styles.modalLabel}>Pickup</Text>
                <Text style={styles.modalValue}>{pickupAddress}</Text>
              </View>

              <View style={styles.modalItem}>
                <Text style={styles.modalLabel}>Drop Destination</Text>
                <Text style={styles.modalValue}>{dropAddress}</Text>
              </View>

              <View style={styles.modalItem}>
                <Text style={styles.modalLabel}>Booking Mode</Text>
                <Text style={styles.modalValue}>
                  {bookingMode === "instant"
                    ? "⚡ Instant Dispatch"
                    : `📅 ${scheduleTime}`}
                </Text>
              </View>

              <View style={styles.modalItem}>
                <Text style={styles.modalLabel}>Helper Service</Text>
                <Text style={styles.modalValue}>
                  {helperCount === 0
                    ? "Driver Only"
                    : helperCount === 1
                    ? "Driver + 1 Helper (+₹200)"
                    : "Driver + 2 Helpers (+₹400)"}
                </Text>
              </View>

              <View style={styles.modalItem}>
                <Text style={styles.modalLabel}>Goods Description (Optional)</Text>
                <TextInput
                  style={styles.goodsInput}
                  placeholder="e.g., 1 Washing Machine, 2 Sofas, 5 Boxes"
                  placeholderTextColor="#9A9EAB"
                  value={itemDescription}
                  onChangeText={setItemDescription}
                />
              </View>

              <View style={styles.priceBreakdownCard}>
                <View style={styles.breakdownRow}>
                  <Text style={styles.breakdownLabel}>Base Fare</Text>
                  <Text style={styles.breakdownValue}>
                    {formatPaiseToINR(selectedVehicle.baseFarePaise)}
                  </Text>
                </View>
                {helperCount > 0 && (
                  <View style={styles.breakdownRow}>
                    <Text style={styles.breakdownLabel}>
                      Helper Charges ({helperCount})
                    </Text>
                    <Text style={styles.breakdownValue}>
                      {formatPaiseToINR(helperFeePaise)}
                    </Text>
                  </View>
                )}
                <View style={styles.divider} />
                <View style={styles.breakdownRow}>
                  <Text style={styles.breakdownTotalLabel}>Estimated Total</Text>
                  <Text style={styles.breakdownTotalValue}>
                    {formatPaiseToINR(estimatedFarePaise)}
                  </Text>
                </View>
              </View>

              <CarryButton
                title="Confirm & Request Driver"
                onPress={handleConfirmOrder}
              />
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollFlex: {
    flex: 1,
  },
  scrollContent: {
    padding: 18,
    paddingBottom: 30,
  },
  // 1. Header Styles
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerLogo: {
    width: 90,
    height: 40,
  },
  cityPill: {
    backgroundColor: colors.surface,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    marginLeft: 8,
  },
  cityPillText: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.primary,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
    borderWidth: 1,
    borderColor: colors.border,
    position: "relative",
  },
  iconButtonEmoji: {
    fontSize: 18,
  },
  notificationDot: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  avatarButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.customerTint,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E0DBFF",
  },
  avatarEmoji: {
    fontSize: 18,
  },
  // 2. Welcome Section
  welcomeHero: {
    marginBottom: 18,
  },
  welcomeTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: colors.text,
    letterSpacing: -0.5,
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: colors.secondaryText,
    marginTop: 4,
    lineHeight: 20,
  },
  // 4. Booking Type Toggle
  bookingTypeContainer: {
    flexDirection: "row",
    backgroundColor: "#EBEFF8",
    borderRadius: 14,
    padding: 4,
    marginBottom: 14,
  },
  bookingTypeTab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 10,
  },
  bookingTypeTabActive: {
    backgroundColor: colors.surface,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  bookingTypeText: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.secondaryText,
  },
  bookingTypeTextActive: {
    color: colors.primary,
    fontWeight: "800",
  },
  scheduleBadgeRow: {
    marginBottom: 14,
  },
  // 3. Location Section
  locationCard: {
    padding: 16,
    marginBottom: 18,
  },
  sectionHeading: {
    fontSize: 15,
    fontWeight: "800",
    color: colors.text,
    marginBottom: 12,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F5FA",
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
  },
  locationPinGreen: {
    fontSize: 12,
    marginRight: 8,
  },
  locationPinRed: {
    fontSize: 12,
    marginRight: 8,
  },
  locationInput: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
  },
  clearText: {
    fontSize: 14,
    color: colors.secondaryText,
    paddingHorizontal: 6,
  },
  routeDivider: {
    height: 10,
    width: 2,
    backgroundColor: colors.border,
    marginLeft: 17,
    marginVertical: 2,
  },
  quickChipsContainer: {
    marginTop: 14,
  },
  quickChipLabel: {
    fontSize: 12,
    color: colors.secondaryText,
    marginBottom: 6,
    fontWeight: "600",
  },
  quickChip: {
    backgroundColor: colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: 8,
  },
  quickChipText: {
    fontSize: 12,
    color: colors.text,
    fontWeight: "600",
  },
  // 5. Vehicle Categories
  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
    marginTop: 6,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.text,
    marginBottom: 12,
    marginTop: 8,
  },
  vehicleGrid: {
    marginBottom: 18,
  },
  vehicleCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1.5,
    borderColor: colors.border,
    marginBottom: 10,
    position: "relative",
  },
  vehicleCardSelected: {
    borderColor: colors.primary,
    backgroundColor: "#FAF9FF",
  },
  vehicleTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  vehicleIcon: {
    fontSize: 26,
  },
  vehicleName: {
    fontSize: 16,
    fontWeight: "800",
    color: colors.text,
    marginTop: 8,
  },
  vehicleTagline: {
    fontSize: 12,
    color: colors.secondaryText,
    marginTop: 2,
  },
  vehicleBottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#F0F2F6",
  },
  vehicleDims: {
    fontSize: 12,
    color: colors.secondaryText,
    fontWeight: "500",
  },
  vehiclePrice: {
    fontSize: 14,
    fontWeight: "800",
    color: colors.primary,
  },
  selectedIndicator: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  // 6. Helper Selection
  helperOptionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 18,
  },
  helperOptionCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 12,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: colors.border,
    marginHorizontal: 4,
  },
  helperOptionCardSelected: {
    borderColor: colors.primary,
    backgroundColor: "#FAF9FF",
  },
  helperIcon: {
    fontSize: 22,
    marginBottom: 4,
  },
  helperTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.text,
  },
  helperPrice: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: "800",
    marginTop: 4,
  },
  // Fare Summary Action Card
  fareSummaryCard: {
    padding: 16,
    marginBottom: 18,
  },
  fareRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  fareLabel: {
    fontSize: 12,
    color: colors.secondaryText,
    fontWeight: "600",
  },
  fareAmount: {
    fontSize: 24,
    fontWeight: "800",
    color: colors.primary,
    marginTop: 2,
  },
  fareSubtext: {
    fontSize: 11,
    color: colors.secondaryText,
    marginTop: 2,
    maxWidth: 180,
  },
  bookNowButton: {
    height: 48,
    paddingHorizontal: 22,
  },
  // Recent Bookings
  recentBookingsCard: {
    padding: 8,
  },
  // Bottom Navigation
  bottomNav: {
    flexDirection: "row",
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingVertical: 10,
    paddingBottom: 16,
  },
  navItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  navIcon: {
    fontSize: 20,
    opacity: 0.6,
  },
  navIconActive: {
    opacity: 1,
  },
  navLabel: {
    fontSize: 11,
    color: colors.secondaryText,
    marginTop: 3,
    fontWeight: "600",
  },
  navLabelActive: {
    color: colors.primary,
    fontWeight: "800",
  },
  // Screen Tabs
  tabScreenTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: colors.text,
    marginBottom: 4,
  },
  tabScreenSubtitle: {
    fontSize: 14,
    color: colors.secondaryText,
    marginBottom: 20,
  },
  notificationCard: {
    flexDirection: "row",
    padding: 16,
    alignItems: "flex-start",
  },
  notificationIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  notificationTextContainer: {
    flex: 1,
  },
  notificationHeading: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 4,
  },
  notificationBody: {
    fontSize: 13,
    color: colors.secondaryText,
    lineHeight: 18,
  },
  notificationTimestamp: {
    fontSize: 11,
    color: "#9A9EAB",
    marginTop: 6,
  },
  profileCard: {
    padding: 18,
    marginBottom: 16,
  },
  profileHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  avatarLarge: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  avatarLargeText: {
    fontSize: 22,
    color: "#FFFFFF",
    fontWeight: "800",
  },
  profileName: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.text,
  },
  profileEmail: {
    fontSize: 13,
    color: colors.secondaryText,
    marginTop: 2,
  },
  profilePhone: {
    fontSize: 13,
    color: colors.secondaryText,
    marginTop: 1,
  },
  badgeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 6,
  },
  spacerBadge: {
    width: 8,
  },
  guestTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.text,
    marginBottom: 4,
  },
  guestSubtitle: {
    fontSize: 13,
    color: colors.secondaryText,
    lineHeight: 18,
    marginBottom: 16,
  },
  actionCard: {
    marginBottom: 10,
    padding: 16,
  },
  actionCardRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionIcon: {
    fontSize: 22,
    marginRight: 14,
  },
  actionTextWrapper: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.text,
  },
  actionDesc: {
    fontSize: 12,
    color: colors.secondaryText,
    marginTop: 2,
  },
  chevron: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: "800",
  },
  logoutWrapper: {
    marginTop: 18,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 22,
    maxHeight: "85%",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 18,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.text,
  },
  modalCloseText: {
    fontSize: 18,
    color: colors.secondaryText,
    padding: 4,
  },
  modalItem: {
    marginBottom: 12,
  },
  modalLabel: {
    fontSize: 12,
    color: colors.secondaryText,
    fontWeight: "600",
  },
  modalValue: {
    fontSize: 14,
    color: colors.text,
    fontWeight: "700",
    marginTop: 2,
  },
  goodsInput: {
    height: 46,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 12,
    fontSize: 14,
    color: colors.text,
    marginTop: 4,
  },
  priceBreakdownCard: {
    backgroundColor: "#F7F8FC",
    borderRadius: 14,
    padding: 14,
    marginVertical: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  breakdownRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  breakdownLabel: {
    fontSize: 13,
    color: colors.secondaryText,
  },
  breakdownValue: {
    fontSize: 13,
    color: colors.text,
    fontWeight: "600",
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 8,
  },
  breakdownTotalLabel: {
    fontSize: 15,
    fontWeight: "800",
    color: colors.text,
  },
  breakdownTotalValue: {
    fontSize: 16,
    fontWeight: "800",
    color: colors.primary,
  },
});
