import React, { useState } from "react";
import {
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ArrowUpDown,
  Bell,
  Calendar,
  Check,
  Clock,
  Compass,
  MapPin,
  Package,
  SlidersHorizontal,
  Truck,
  User,
  Zap,
} from "lucide-react-native";
import { useCarryAuth } from "../auth/AuthContext";
import { CarryLogo } from "../components/CarryLogo";
import { CarryMapPreview } from "../components/CarryMapPreview";
import {
  CarryButton,
  CarryCard,
  CarryChip,
  CarryStatusTag,
} from "../components/CarryUI";
import { CarryVehicleArt, VehicleCategory } from "../components/CarryVehicleArt";
import CustomerBookingDetailsModal, {
  BookingDetailsData,
} from "./customer/CustomerBookingDetailsModal";
import CustomerBookingsScreen from "./customer/CustomerBookingsScreen";
import CustomerNotificationsScreen from "./customer/CustomerNotificationsScreen";
import CustomerProfileScreen from "./customer/CustomerProfileScreen";
import CustomerSavedAddressesModal from "./customer/CustomerSavedAddressesModal";
import CustomerTrackingModal from "./customer/CustomerTrackingModal";
import { colors } from "../theme/colors";

interface Props {
  onOpenAuth?: () => void;
  onSwitchPortal?: () => void;
}

type TabType = "home" | "bookings" | "notifications" | "profile";
type BookingMode = "instant" | "schedule";

interface VehicleOption {
  id: string;
  category: VehicleCategory;
  name: string;
  capacity: string;
  size: string;
  baseFarePaise: number;
  ratePerKmPaise: number;
  etaMinutes: number;
  bestFor: string;
}

const VEHICLES: VehicleOption[] = [
  {
    id: "mini",
    category: "mini",
    name: "Mini Truck (Tata Ace)",
    capacity: "750 kg",
    size: "7 × 4.5 ft",
    baseFarePaise: 24900,
    ratePerKmPaise: 1800,
    etaMinutes: 6,
    bestFor: "Furniture, boxes, shop goods",
  },
  {
    id: "small",
    category: "small",
    name: "Bolero Pickup",
    capacity: "1,200 kg",
    size: "8 × 5 ft",
    baseFarePaise: 39900,
    ratePerKmPaise: 2400,
    etaMinutes: 10,
    bestFor: "1-2 BHK moves, machinery, hardware",
  },
  {
    id: "medium",
    category: "medium",
    name: "Medium Truck (Tata 407)",
    capacity: "2,500 kg",
    size: "10 × 6 ft",
    baseFarePaise: 69900,
    ratePerKmPaise: 3200,
    etaMinutes: 14,
    bestFor: "Full house moves, commercial stock",
  },
  {
    id: "large",
    category: "large",
    name: "Large Truck (14ft / 17ft)",
    capacity: "4,000 kg",
    size: "14 × 6.5 ft",
    baseFarePaise: 99900,
    ratePerKmPaise: 4200,
    etaMinutes: 20,
    bestFor: "Heavy industrial loads, warehouse moves",
  },
];

const COIMBATORE_AREAS = [
  "Gandhipuram",
  "RS Puram",
  "Peelamedu",
  "Saravanampatti",
  "Singanallur",
  "Ganapathy",
  "Ukkadam",
];

export default function CustomerHomeScreen({
  onOpenAuth,
  onSwitchPortal,
}: Props) {
  const { profile, firebaseUser } = useCarryAuth();
  const [activeTab, setActiveTab] = useState<TabType>("home");

  // Booking Flow State
  const [bookingMode, setBookingMode] = useState<BookingMode>("instant");
  const [scheduleTime, setScheduleTime] = useState("Today, 4:00 PM");
  const [pickupAddress, setPickupAddress] = useState("Gandhipuram, Coimbatore");
  const [dropAddress, setDropAddress] = useState("Peelamedu, Coimbatore");
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleOption>(
    VEHICLES[0]
  );

  // Modal controls
  const [showBookingDetailsModal, setShowBookingDetailsModal] = useState(false);
  const [showSavedAddressesModal, setShowSavedAddressesModal] = useState(false);
  const [addressTarget, setAddressTarget] = useState<"pickup" | "drop">("pickup");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isSearchingDriver, setIsSearchingDriver] = useState(false);
  const [activeTrackingBooking, setActiveTrackingBooking] = useState<any | null>(null);

  // Booking Details configuration
  const [bookingDetails, setBookingDetails] = useState<BookingDetailsData>({
    category: "Furniture & Home",
    pickupFloor: 0,
    pickupLift: true,
    dropFloor: 1,
    dropLift: true,
    helpers: 1,
    instructions: "Please handle cartons with care",
  });

  // Helper fee calculation (paise)
  const helperFeePaise =
    bookingDetails.helpers === 1
      ? 25000
      : bookingDetails.helpers === 2
      ? 45000
      : 0;

  // Estimated 8 km journey for Coimbatore
  const estimatedKm = 8;
  const distanceFarePaise = estimatedKm * selectedVehicle.ratePerKmPaise;
  const totalFarePaise =
    selectedVehicle.baseFarePaise + distanceFarePaise + helperFeePaise;

  const formatINR = (paise: number) => `₹${Math.round(paise / 100)}`;

  const handleQuickAreaSelect = (area: string) => {
    if (!pickupAddress) {
      setPickupAddress(`${area}, Coimbatore`);
    } else {
      setDropAddress(`${area}, Coimbatore`);
    }
  };

  const handleSwapAddresses = () => {
    const temp = pickupAddress;
    setPickupAddress(dropAddress);
    setDropAddress(temp);
  };

  const handleOpenSavedAddresses = (target: "pickup" | "drop") => {
    setAddressTarget(target);
    setShowSavedAddressesModal(true);
  };

  const handleSelectSavedAddress = (addrText: string) => {
    if (addressTarget === "pickup") {
      setPickupAddress(addrText);
    } else {
      setDropAddress(addrText);
    }
  };

  const handleConfirmAndSearch = () => {
    if (!pickupAddress.trim() || !dropAddress.trim()) {
      Alert.alert("Locations required", "Please enter both pickup and drop addresses.");
      return;
    }

    setShowConfirmModal(false);
    setIsSearchingDriver(true);

    // Simulate matching driver in Coimbatore
    setTimeout(() => {
      setIsSearchingDriver(false);
      setActiveTrackingBooking({
        id: `CRY-${Math.floor(10000 + Math.random() * 90000)}`,
        pickup: pickupAddress,
        drop: dropAddress,
        vehicleName: selectedVehicle.name,
        totalFare: formatINR(totalFarePaise),
        status: "Driver Assigned",
        helperCount: bookingDetails.helpers,
      });
    }, 2000);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top Header */}
      <View style={styles.header}>
        <CarryLogo size={26} tone="dark" variant="wheel" />

        <View style={styles.headerRight}>
          <Pressable
            onPress={() => setActiveTab("notifications")}
            style={styles.headerIconBtn}
          >
            <Bell size={18} color={colors.primaryBlack} />
          </Pressable>

          <Pressable
            onPress={() => setActiveTab("profile")}
            style={styles.avatarPill}
          >
            <User size={16} color={colors.white} />
          </Pressable>
        </View>
      </View>

      {/* Main Tab Content */}
      {activeTab === "home" && (
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Instant vs Schedule Toggle */}
          <View style={styles.modeToggle}>
            <Pressable
              onPress={() => setBookingMode("instant")}
              style={[
                styles.modeBtn,
                bookingMode === "instant" && styles.modeBtnActive,
              ]}
            >
              <Zap
                size={14}
                color={
                  bookingMode === "instant" ? colors.white : colors.secondaryText
                }
              />
              <Text
                style={[
                  styles.modeBtnText,
                  bookingMode === "instant" && styles.modeBtnTextActive,
                ]}
              >
                Instant Move
              </Text>
            </Pressable>

            <Pressable
              onPress={() => setBookingMode("schedule")}
              style={[
                styles.modeBtn,
                bookingMode === "schedule" && styles.modeBtnActive,
              ]}
            >
              <Clock
                size={14}
                color={
                  bookingMode === "schedule"
                    ? colors.white
                    : colors.secondaryText
                }
              />
              <Text
                style={[
                  styles.modeBtnText,
                  bookingMode === "schedule" && styles.modeBtnTextActive,
                ]}
              >
                Schedule Move
              </Text>
            </Pressable>
          </View>

          {/* Location Entry Card */}
          <CarryCard style={styles.locationCard}>
            <View style={styles.locationInputRow}>
              <View style={styles.pinCircleBlack}>
                <View style={styles.innerDotWhite} />
              </View>
              <View style={styles.locationInputWrapper}>
                <View style={styles.locationLabelRow}>
                  <Text style={styles.locationLabel}>PICKUP LOCATION</Text>
                  <Pressable
                    onPress={() => handleOpenSavedAddresses("pickup")}
                    style={styles.savedAddrBtn}
                  >
                    <Text style={styles.savedAddrText}>Saved Addresses</Text>
                  </Pressable>
                </View>
                <TextInput
                  style={styles.locationInput}
                  value={pickupAddress}
                  onChangeText={setPickupAddress}
                  placeholder="Enter pickup address in Coimbatore"
                  placeholderTextColor={colors.disabledGrey}
                />
              </View>
            </View>

            <View style={styles.locationDividerRow}>
              <View style={styles.connectorLine} />
              <Pressable
                onPress={handleSwapAddresses}
                style={styles.swapBtn}
              >
                <ArrowUpDown size={14} color={colors.primaryBlack} />
              </Pressable>
            </View>

            <View style={styles.locationInputRow}>
              <View style={styles.pinCircleBlack}>
                <View style={styles.innerSquareWhite} />
              </View>
              <View style={styles.locationInputWrapper}>
                <View style={styles.locationLabelRow}>
                  <Text style={styles.locationLabel}>DROP DESTINATION</Text>
                  <Pressable
                    onPress={() => handleOpenSavedAddresses("drop")}
                    style={styles.savedAddrBtn}
                  >
                    <Text style={styles.savedAddrText}>Saved Addresses</Text>
                  </Pressable>
                </View>
                <TextInput
                  style={styles.locationInput}
                  value={dropAddress}
                  onChangeText={setDropAddress}
                  placeholder="Enter drop address in Coimbatore"
                  placeholderTextColor={colors.disabledGrey}
                />
              </View>
            </View>
          </CarryCard>

          {/* Quick Coimbatore Area Chips */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.areasScroll}
            contentContainerStyle={styles.areasContent}
          >
            {COIMBATORE_AREAS.map((area) => (
              <CarryChip
                key={area}
                label={area}
                onPress={() => handleQuickAreaSelect(area)}
              />
            ))}
          </ScrollView>

          {/* Route Map Preview */}
          <View style={styles.mapContainer}>
            <CarryMapPreview height={140} showRoute />
          </View>

          {/* Vehicle Selection Section */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Choose Vehicle</Text>
            <Text style={styles.sectionSub}>Upfront prices, no surge</Text>
          </View>

          <View style={styles.vehiclesGrid}>
            {VEHICLES.map((v) => {
              const isSelected = selectedVehicle.id === v.id;
              const estimatedPaise =
                v.baseFarePaise + estimatedKm * v.ratePerKmPaise + helperFeePaise;

              return (
                <CarryCard
                  key={v.id}
                  onPress={() => setSelectedVehicle(v)}
                  style={[
                    styles.vehicleCard,
                    isSelected && styles.vehicleCardSelected,
                  ]}
                >
                  <View style={styles.vehicleArtWrapper}>
                    <CarryVehicleArt type={v.category} width={90} />
                  </View>

                  <View style={styles.vehicleInfo}>
                    <View style={styles.vehicleNameRow}>
                      <Text style={styles.vehicleName}>{v.name}</Text>
                      <Text style={styles.vehiclePrice}>
                        {formatINR(estimatedPaise)}
                      </Text>
                    </View>

                    <Text style={styles.vehicleSpecs}>
                      {v.capacity} • {v.size} • ~{v.etaMinutes} min away
                    </Text>
                    <Text style={styles.vehicleBestFor}>{v.bestFor}</Text>
                  </View>
                </CarryCard>
              );
            })}
          </View>

          {/* Move & Helpers Configuration Card */}
          <CarryCard
            onPress={() => setShowBookingDetailsModal(true)}
            style={styles.detailsConfigCard}
          >
            <View style={styles.detailsConfigRow}>
              <View style={styles.detailsIconCircle}>
                <SlidersHorizontal size={18} color={colors.primaryBlack} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.detailsConfigTitle}>
                  Move Details & Helpers
                </Text>
                <Text style={styles.detailsConfigSub}>
                  {bookingDetails.category} •{" "}
                  {bookingDetails.helpers === 0
                    ? "Driver only"
                    : `${bookingDetails.helpers} Helper`}
                  {" • "}
                  {bookingDetails.pickupLift ? "Lift available" : "Stairs"}
                </Text>
              </View>
              <CarryStatusTag tone="outline">Configure</CarryStatusTag>
            </View>
          </CarryCard>

          {/* Transparent Upfront Fare Summary */}
          <CarryCard style={styles.fareCard}>
            <View style={styles.fareRow}>
              <Text style={styles.fareLabel}>Base Fare ({selectedVehicle.name})</Text>
              <Text style={styles.fareValue}>
                {formatINR(selectedVehicle.baseFarePaise)}
              </Text>
            </View>
            <View style={styles.fareRow}>
              <Text style={styles.fareLabel}>Estimated Distance (~{estimatedKm} km)</Text>
              <Text style={styles.fareValue}>{formatINR(distanceFarePaise)}</Text>
            </View>
            {bookingDetails.helpers > 0 && (
              <View style={styles.fareRow}>
                <Text style={styles.fareLabel}>
                  {bookingDetails.helpers} Helper{bookingDetails.helpers > 1 ? "s" : ""}
                </Text>
                <Text style={styles.fareValue}>{formatINR(helperFeePaise)}</Text>
              </View>
            )}
            <View style={[styles.fareRow, styles.fareTotalRow]}>
              <Text style={styles.totalLabel}>Total Estimated Fare</Text>
              <Text style={styles.totalValue}>{formatINR(totalFarePaise)}</Text>
            </View>
          </CarryCard>
        </ScrollView>
      )}

      {/* Bookings Tab */}
      {activeTab === "bookings" && <CustomerBookingsScreen />}

      {/* Notifications Tab */}
      {activeTab === "notifications" && <CustomerNotificationsScreen />}

      {/* Profile Tab */}
      {activeTab === "profile" && (
        <CustomerProfileScreen
          onOpenAuth={onOpenAuth}
          onSwitchPortal={onSwitchPortal}
        />
      )}

      {/* Bottom Action Bar on Home Tab */}
      {activeTab === "home" && (
        <View style={styles.bottomBar}>
          <CarryButton
            onPress={() => setShowConfirmModal(true)}
            variant="primary"
          >
            {bookingMode === "instant"
              ? `Book ${selectedVehicle.name} • ${formatINR(totalFarePaise)}`
              : `Schedule for ${scheduleTime} • ${formatINR(totalFarePaise)}`}
          </CarryButton>
        </View>
      )}

      {/* Fixed Customer Bottom Navigation */}
      <View style={styles.navBar}>
        <Pressable
          onPress={() => setActiveTab("home")}
          style={styles.navItem}
        >
          <Truck
            size={22}
            color={
              activeTab === "home"
                ? colors.primaryBlack
                : colors.disabledGrey
            }
          />
          <Text
            style={[
              styles.navText,
              activeTab === "home" && styles.navTextActive,
            ]}
          >
            Home
          </Text>
          {activeTab === "home" && <View style={styles.activeTabIndicator} />}
        </Pressable>

        <Pressable
          onPress={() => setActiveTab("bookings")}
          style={styles.navItem}
        >
          <Package
            size={22}
            color={
              activeTab === "bookings"
                ? colors.primaryBlack
                : colors.disabledGrey
            }
          />
          <Text
            style={[
              styles.navText,
              activeTab === "bookings" && styles.navTextActive,
            ]}
          >
            Bookings
          </Text>
          {activeTab === "bookings" && (
            <View style={styles.activeTabIndicator} />
          )}
        </Pressable>

        <Pressable
          onPress={() => setActiveTab("notifications")}
          style={styles.navItem}
        >
          <Bell
            size={22}
            color={
              activeTab === "notifications"
                ? colors.primaryBlack
                : colors.disabledGrey
            }
          />
          <Text
            style={[
              styles.navText,
              activeTab === "notifications" && styles.navTextActive,
            ]}
          >
            Notifications
          </Text>
          {activeTab === "notifications" && (
            <View style={styles.activeTabIndicator} />
          )}
        </Pressable>

        <Pressable
          onPress={() => setActiveTab("profile")}
          style={styles.navItem}
        >
          <User
            size={22}
            color={
              activeTab === "profile"
                ? colors.primaryBlack
                : colors.disabledGrey
            }
          />
          <Text
            style={[
              styles.navText,
              activeTab === "profile" && styles.navTextActive,
            ]}
          >
            Profile
          </Text>
          {activeTab === "profile" && (
            <View style={styles.activeTabIndicator} />
          )}
        </Pressable>
      </View>

      {/* Booking Review & Confirmation Sheet */}
      <Modal
        visible={showConfirmModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowConfirmModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalGrabber} />
            <Text style={styles.modalTitle}>Confirm your move</Text>
            <Text style={styles.modalSub}>
              Review your details before we dispatch a Coimbatore driver.
            </Text>

            <View style={styles.modalSummary}>
              <View style={styles.modalRow}>
                <Text style={styles.modalLabel}>Vehicle</Text>
                <Text style={styles.modalVal}>{selectedVehicle.name}</Text>
              </View>
              <View style={styles.modalRow}>
                <Text style={styles.modalLabel}>Pickup</Text>
                <Text style={styles.modalVal}>{pickupAddress}</Text>
              </View>
              <View style={styles.modalRow}>
                <Text style={styles.modalLabel}>Drop</Text>
                <Text style={styles.modalVal}>{dropAddress}</Text>
              </View>
              <View style={styles.modalRow}>
                <Text style={styles.modalLabel}>Helpers</Text>
                <Text style={styles.modalVal}>
                  {bookingDetails.helpers === 0
                    ? "Driver only"
                    : `${bookingDetails.helpers} Helper`}
                </Text>
              </View>
              <View style={[styles.modalRow, styles.modalTotal]}>
                <Text style={styles.modalTotalLabel}>Total Fare</Text>
                <Text style={styles.modalTotalVal}>{formatINR(totalFarePaise)}</Text>
              </View>
            </View>

            <View style={styles.modalButtons}>
              <CarryButton onPress={handleConfirmAndSearch} variant="primary">
                Confirm & Request Driver
              </CarryButton>
              <CarryButton
                onPress={() => setShowConfirmModal(false)}
                variant="ghost"
              >
                Cancel
              </CarryButton>
            </View>
          </View>
        </View>
      </Modal>

      {/* Searching for Driver Simulation Overlay */}
      <Modal visible={isSearchingDriver} transparent animationType="fade">
        <View style={styles.searchingOverlay}>
          <View style={styles.searchingBox}>
            <View style={styles.searchingArt}>
              <CarryVehicleArt type={selectedVehicle.category} width={100} />
            </View>
            <Text style={styles.searchingTitle}>Searching for nearby drivers…</Text>
            <Text style={styles.searchingSub}>
              Contacting verified partners near {pickupAddress.split(",")[0]}
            </Text>
          </View>
        </View>
      </Modal>

      {/* Move Details Modal */}
      <CustomerBookingDetailsModal
        visible={showBookingDetailsModal}
        onClose={() => setShowBookingDetailsModal(false)}
        initialData={bookingDetails}
        onProceed={setBookingDetails}
      />

      {/* Saved Addresses Modal */}
      <CustomerSavedAddressesModal
        visible={showSavedAddressesModal}
        onClose={() => setShowSavedAddressesModal(false)}
        onSelectAddress={handleSelectSavedAddress}
      />

      {/* Live Move Tracking Modal */}
      {activeTrackingBooking && (
        <CustomerTrackingModal
          visible={!!activeTrackingBooking}
          onClose={() => setActiveTrackingBooking(null)}
          booking={activeTrackingBooking}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderGrey,
    backgroundColor: colors.cardSurface,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  headerIconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.lightGrey,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarPill: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.primaryBlack,
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 32,
  },
  modeToggle: {
    flexDirection: "row",
    backgroundColor: colors.lightGrey,
    borderRadius: 14,
    padding: 3,
    marginBottom: 16,
  },
  modeBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 10,
    borderRadius: 11,
  },
  modeBtnActive: {
    backgroundColor: colors.primaryBlack,
  },
  modeBtnText: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.secondaryText,
  },
  modeBtnTextActive: {
    color: colors.white,
  },
  locationCard: {
    padding: 16,
  },
  locationInputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  locationInputWrapper: {
    flex: 1,
  },
  locationLabelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  locationLabel: {
    fontSize: 10,
    fontWeight: "800",
    color: colors.secondaryText,
    letterSpacing: 0.5,
  },
  savedAddrBtn: {
    paddingHorizontal: 4,
  },
  savedAddrText: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.primaryBlack,
    textDecorationLine: "underline",
  },
  locationInput: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.mainText,
    paddingVertical: 4,
  },
  pinCircleBlack: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.primaryBlack,
    alignItems: "center",
    justifyContent: "center",
  },
  innerDotWhite: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.white,
  },
  innerSquareWhite: {
    width: 7,
    height: 7,
    backgroundColor: colors.white,
    borderRadius: 1.5,
  },
  locationDividerRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 10,
    marginVertical: 4,
  },
  connectorLine: {
    width: 2,
    height: 20,
    backgroundColor: colors.borderGrey,
  },
  swapBtn: {
    marginLeft: 16,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.lightGrey,
    alignItems: "center",
    justifyContent: "center",
  },
  areasScroll: {
    marginVertical: 14,
  },
  areasContent: {
    gap: 8,
  },
  mapContainer: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.primaryBlack,
    letterSpacing: -0.4,
  },
  sectionSub: {
    fontSize: 13,
    color: colors.secondaryText,
  },
  vehiclesGrid: {
    gap: 12,
    marginBottom: 18,
  },
  vehicleCard: {
    padding: 14,
    borderWidth: 1.5,
    borderColor: colors.borderGrey,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  vehicleCardSelected: {
    borderColor: colors.primaryBlack,
    backgroundColor: colors.cardSurface,
  },
  vehicleArtWrapper: {
    width: 80,
    alignItems: "center",
    justifyContent: "center",
  },
  vehicleInfo: {
    flex: 1,
  },
  vehicleNameRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  vehicleName: {
    fontSize: 15,
    fontWeight: "800",
    color: colors.primaryBlack,
  },
  vehiclePrice: {
    fontSize: 16,
    fontWeight: "900",
    color: colors.primaryBlack,
  },
  vehicleSpecs: {
    fontSize: 12,
    color: colors.secondaryText,
    marginTop: 4,
  },
  vehicleBestFor: {
    fontSize: 12,
    color: colors.mainText,
    fontWeight: "500",
    marginTop: 4,
  },
  detailsConfigCard: {
    padding: 16,
    marginBottom: 16,
  },
  detailsConfigRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  detailsIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.lightGrey,
    alignItems: "center",
    justifyContent: "center",
  },
  detailsConfigTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: colors.primaryBlack,
  },
  detailsConfigSub: {
    fontSize: 12,
    color: colors.secondaryText,
    marginTop: 2,
  },
  fareCard: {
    padding: 16,
    gap: 8,
    marginBottom: 16,
  },
  fareRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  fareLabel: {
    fontSize: 14,
    color: colors.secondaryText,
  },
  fareValue: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.mainText,
  },
  fareTotalRow: {
    borderTopWidth: 1,
    borderTopColor: colors.borderGrey,
    paddingTop: 10,
    marginTop: 4,
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: "800",
    color: colors.primaryBlack,
  },
  totalValue: {
    fontSize: 20,
    fontWeight: "900",
    color: colors.primaryBlack,
  },
  bottomBar: {
    borderTopWidth: 1,
    borderTopColor: colors.borderGrey,
    backgroundColor: colors.cardSurface,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 14,
  },
  navBar: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: colors.borderGrey,
    backgroundColor: colors.cardSurface,
    height: 60,
    alignItems: "center",
  },
  navItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    position: "relative",
  },
  navText: {
    fontSize: 11,
    fontWeight: "600",
    color: colors.disabledGrey,
    marginTop: 2,
  },
  navTextActive: {
    color: colors.primaryBlack,
    fontWeight: "800",
  },
  activeTabIndicator: {
    position: "absolute",
    bottom: 2,
    width: 24,
    height: 2,
    backgroundColor: colors.primaryBlack,
    borderRadius: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: colors.cardSurface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 32,
  },
  modalGrabber: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.borderGrey,
    alignSelf: "center",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: colors.primaryBlack,
    letterSpacing: -0.5,
  },
  modalSub: {
    fontSize: 14,
    color: colors.secondaryText,
    marginTop: 4,
    marginBottom: 20,
  },
  modalSummary: {
    backgroundColor: colors.background,
    borderRadius: 16,
    padding: 16,
    gap: 12,
    marginBottom: 20,
  },
  modalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalLabel: {
    fontSize: 14,
    color: colors.secondaryText,
  },
  modalVal: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.mainText,
  },
  modalTotal: {
    borderTopWidth: 1,
    borderTopColor: colors.borderGrey,
    paddingTop: 10,
  },
  modalTotalLabel: {
    fontSize: 16,
    fontWeight: "800",
    color: colors.primaryBlack,
  },
  modalTotalVal: {
    fontSize: 20,
    fontWeight: "900",
    color: colors.primaryBlack,
  },
  modalButtons: {
    gap: 8,
  },
  searchingOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  searchingBox: {
    width: "100%",
    backgroundColor: colors.cardSurface,
    borderRadius: 20,
    padding: 28,
    alignItems: "center",
  },
  searchingArt: {
    marginBottom: 16,
  },
  searchingTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: colors.primaryBlack,
    textAlign: "center",
  },
  searchingSub: {
    fontSize: 14,
    color: colors.secondaryText,
    textAlign: "center",
    marginTop: 6,
    lineHeight: 20,
  },
});
