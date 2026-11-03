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
  LogOut,
  MapPin,
  Package,
  Shield,
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
import { colors } from "../theme/colors";

interface Props {
  onSwitchPortal: () => void;
  onOpenAuth?: () => void;
}

type TabType = "home" | "bookings" | "notifications" | "profile";
type BookingMode = "instant" | "schedule";
type HelperOption = 0 | 1 | 2;

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
  onSwitchPortal,
  onOpenAuth,
}: Props) {
  const { profile, firebaseUser, logout } = useCarryAuth();
  const [activeTab, setActiveTab] = useState<TabType>("home");

  // Booking Flow State
  const [bookingMode, setBookingMode] = useState<BookingMode>("instant");
  const [scheduleTime, setScheduleTime] = useState("Today, 4:00 PM");
  const [pickupAddress, setPickupAddress] = useState("Gandhipuram, Coimbatore");
  const [dropAddress, setDropAddress] = useState("Peelamedu, Coimbatore");
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleOption>(
    VEHICLES[0]
  );
  const [helperCount, setHelperCount] = useState<HelperOption>(1);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Helper fee calculation (in paise)
  const helperFeePaise =
    helperCount === 1 ? 25000 : helperCount === 2 ? 45000 : 0;
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

  const handleConfirmBooking = () => {
    if (!firebaseUser && onOpenAuth) {
      setShowConfirmModal(false);
      onOpenAuth();
      return;
    }
    setShowConfirmModal(false);
    setBookingSuccess(true);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top App Header matching Magic Patterns */}
      <View style={styles.header}>
        <CarryLogo size={26} tone="dark" variant="wheel" />

        <View style={styles.headerRight}>
          <Pressable onPress={onSwitchPortal} style={styles.portalToggle}>
            <Truck size={14} color={colors.ink} />
            <Text style={styles.portalToggleText}>Driver Portal</Text>
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
          {bookingSuccess ? (
            <View style={styles.successCard}>
              <View style={styles.successIconBox}>
                <Check size={28} color="#FFFFFF" strokeWidth={3} />
              </View>
              <Text style={styles.successHeading}>Booking Confirmed!</Text>
              <Text style={styles.successSub}>
                A {selectedVehicle.name} driver in Coimbatore has been assigned to your move.
              </Text>

              <View style={styles.confirmedDetails}>
                <View style={styles.confirmedRow}>
                  <Text style={styles.confirmedLabel}>Pickup</Text>
                  <Text style={styles.confirmedVal}>{pickupAddress}</Text>
                </View>
                <View style={styles.confirmedRow}>
                  <Text style={styles.confirmedLabel}>Drop</Text>
                  <Text style={styles.confirmedVal}>{dropAddress}</Text>
                </View>
                <View style={styles.confirmedRow}>
                  <Text style={styles.confirmedLabel}>Total Fare</Text>
                  <Text style={styles.confirmedFare}>{formatINR(totalFarePaise)}</Text>
                </View>
              </View>

              <CarryButton
                onPress={() => setBookingSuccess(false)}
                variant="primary"
              >
                Book Another Move
              </CarryButton>
            </View>
          ) : (
            <>
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
                    size={15}
                    color={bookingMode === "instant" ? "#FFFFFF" : colors.muted}
                  />
                  <Text
                    style={[
                      styles.modeBtnText,
                      bookingMode === "instant" && styles.modeBtnTextActive,
                    ]}
                  >
                    Move Now
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
                    size={15}
                    color={bookingMode === "schedule" ? "#FFFFFF" : colors.muted}
                  />
                  <Text
                    style={[
                      styles.modeBtnText,
                      bookingMode === "schedule" && styles.modeBtnTextActive,
                    ]}
                  >
                    Schedule
                  </Text>
                </Pressable>
              </View>

              {/* Pickup & Drop Location Card */}
              <CarryCard style={styles.locationCard}>
                <View style={styles.locationInputRow}>
                  <View style={styles.pinCircleGreen}>
                    <View style={styles.innerDotGreen} />
                  </View>
                  <View style={styles.locationInputWrapper}>
                    <Text style={styles.locationLabel}>PICKUP LOCATION</Text>
                    <TextInput
                      style={styles.locationInput}
                      value={pickupAddress}
                      onChangeText={setPickupAddress}
                      placeholder="Enter pickup address in Coimbatore"
                      placeholderTextColor={colors.disabled}
                    />
                  </View>
                </View>

                <View style={styles.locationDividerRow}>
                  <View style={styles.connectorLine} />
                  <Pressable
                    onPress={handleSwapAddresses}
                    style={styles.swapBtn}
                  >
                    <ArrowUpDown size={14} color={colors.ink} />
                  </Pressable>
                </View>

                <View style={styles.locationInputRow}>
                  <View style={styles.pinCircleBlack}>
                    <View style={styles.innerSquareWhite} />
                  </View>
                  <View style={styles.locationInputWrapper}>
                    <Text style={styles.locationLabel}>DROP DESTINATION</Text>
                    <TextInput
                      style={styles.locationInput}
                      value={dropAddress}
                      onChangeText={setDropAddress}
                      placeholder="Enter drop address in Coimbatore"
                      placeholderTextColor={colors.disabled}
                    />
                  </View>
                </View>
              </CarryCard>

              {/* Quick Area Chips */}
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

              {/* Vector Map Preview */}
              <View style={styles.mapContainer}>
                <CarryMapPreview height={140} showRoute />
              </View>

              {/* Vehicle Selection Section */}
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Choose Vehicle</Text>
                <Text style={styles.sectionSub}>All prices upfront</Text>
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
                        <CarryVehicleArt type={v.category} width={100} />
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

              {/* Helpers Selection Card */}
              <CarryCard style={styles.helpersCard}>
                <Text style={styles.helpersTitle}>Loading & Unloading Helpers</Text>
                <Text style={styles.helpersDesc}>
                  Helpers assist with moving heavy cartons, furniture, and stairs.
                </Text>

                <View style={styles.helpersOptionsRow}>
                  {[
                    { count: 0, label: "Driver Only", extra: "Free" },
                    { count: 1, label: "+1 Helper", extra: "+₹250" },
                    { count: 2, label: "+2 Helpers", extra: "+₹450" },
                  ].map((opt) => {
                    const active = helperCount === opt.count;
                    return (
                      <Pressable
                        key={opt.count}
                        onPress={() => setHelperCount(opt.count as HelperOption)}
                        style={[
                          styles.helperOption,
                          active && styles.helperOptionActive,
                        ]}
                      >
                        <Text
                          style={[
                            styles.helperOptLabel,
                            active && styles.helperOptLabelActive,
                          ]}
                        >
                          {opt.label}
                        </Text>
                        <Text
                          style={[
                            styles.helperOptExtra,
                            active && styles.helperOptExtraActive,
                          ]}
                        >
                          {opt.extra}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </CarryCard>

              {/* Fare Breakdown Card */}
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
                {helperCount > 0 && (
                  <View style={styles.fareRow}>
                    <Text style={styles.fareLabel}>
                      {helperCount} Helper{helperCount > 1 ? "s" : ""}
                    </Text>
                    <Text style={styles.fareValue}>{formatINR(helperFeePaise)}</Text>
                  </View>
                )}
                <View style={[styles.fareRow, styles.fareTotalRow]}>
                  <Text style={styles.totalLabel}>Estimated Total</Text>
                  <Text style={styles.totalValue}>{formatINR(totalFarePaise)}</Text>
                </View>
              </CarryCard>
            </>
          )}
        </ScrollView>
      )}

      {/* Bookings Tab */}
      {activeTab === "bookings" && (
        <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
          <Text style={styles.pageTitle}>My Moves</Text>
          <Text style={styles.pageSub}>Active and past deliveries in Coimbatore</Text>

          <CarryCard style={styles.bookingItem}>
            <View style={styles.bookingItemHeader}>
              <CarryStatusTag tone="solid">In Progress</CarryStatusTag>
              <Text style={styles.bookingItemFare}>₹393</Text>
            </View>
            <View style={styles.bookingTripRow}>
              <View style={styles.pinCircleBlack}>
                <View style={styles.innerDotWhite} />
              </View>
              <Text style={styles.bookingAddr}>Gandhipuram Cross Cut Rd</Text>
            </View>
            <View style={styles.bookingTripRow}>
              <View style={styles.pinCircleBlack}>
                <View style={styles.innerSquareWhite} />
              </View>
              <Text style={styles.bookingAddr}>Peelamedu, Avinashi Rd</Text>
            </View>
            <Text style={styles.bookingVehicleInfo}>
              Mini Truck • Tata Ace (TN 38 CD 4821)
            </Text>
          </CarryCard>
        </ScrollView>
      )}

      {/* Profile Tab */}
      {activeTab === "profile" && (
        <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
          <Text style={styles.pageTitle}>Profile</Text>
          <CarryCard style={styles.profileCard}>
            <View style={styles.profileAvatar}>
              <Text style={styles.avatarText}>
                {profile?.fullName ? profile.fullName.charAt(0).toUpperCase() : "C"}
              </Text>
            </View>
            <Text style={styles.profileName}>{profile?.fullName || "Guest Customer"}</Text>
            <Text style={styles.profilePhone}>{profile?.phone || "+91 98430 21765"}</Text>
            <Text style={styles.profileEmail}>{profile?.email || "customer@carry.app"}</Text>
          </CarryCard>

          <CarryCard style={{ marginTop: 16 }}>
            <Pressable onPress={onSwitchPortal} style={styles.menuRow}>
              <Truck size={20} color={colors.ink} />
              <Text style={styles.menuText}>Switch to Driver Portal</Text>
            </Pressable>
            <View style={styles.menuDivider} />
            <Pressable onPress={() => logout()} style={styles.menuRow}>
              <LogOut size={20} color={colors.error} />
              <Text style={[styles.menuText, { color: colors.error }]}>Log out</Text>
            </Pressable>
          </CarryCard>
        </ScrollView>
      )}

      {/* Sticky Bottom Action Bar on Home */}
      {activeTab === "home" && !bookingSuccess && (
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

      {/* Bottom Navigation Tabs */}
      <View style={styles.navBar}>
        <Pressable
          onPress={() => setActiveTab("home")}
          style={styles.navItem}
        >
          <Truck
            size={22}
            color={activeTab === "home" ? colors.ink : colors.disabled}
          />
          <Text
            style={[
              styles.navText,
              activeTab === "home" && styles.navTextActive,
            ]}
          >
            Book
          </Text>
        </Pressable>

        <Pressable
          onPress={() => setActiveTab("bookings")}
          style={styles.navItem}
        >
          <Package
            size={22}
            color={activeTab === "bookings" ? colors.ink : colors.disabled}
          />
          <Text
            style={[
              styles.navText,
              activeTab === "bookings" && styles.navTextActive,
            ]}
          >
            Trips
          </Text>
        </Pressable>

        <Pressable
          onPress={() => setActiveTab("profile")}
          style={styles.navItem}
        >
          <User
            size={22}
            color={activeTab === "profile" ? colors.ink : colors.disabled}
          />
          <Text
            style={[
              styles.navText,
              activeTab === "profile" && styles.navTextActive,
            ]}
          >
            Account
          </Text>
        </Pressable>
      </View>

      {/* Confirmation Modal */}
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
              Review the details before we assign a Coimbatore driver.
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
                  {helperCount === 0 ? "Driver only" : `${helperCount} Helper`}
                </Text>
              </View>
              <View style={[styles.modalRow, styles.modalTotal]}>
                <Text style={styles.modalTotalLabel}>Total Pay</Text>
                <Text style={styles.modalTotalVal}>{formatINR(totalFarePaise)}</Text>
              </View>
            </View>

            <View style={styles.modalButtons}>
              <CarryButton onPress={handleConfirmBooking} variant="primary">
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.paper,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
    backgroundColor: "#FFFFFF",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  portalToggle: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 99,
    backgroundColor: colors.mist,
    borderWidth: 1,
    borderColor: colors.line,
  },
  portalToggleText: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.ink,
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
    backgroundColor: colors.mist,
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
    backgroundColor: colors.ink,
  },
  modeBtnText: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.muted,
  },
  modeBtnTextActive: {
    color: "#FFFFFF",
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
  locationLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.muted,
    letterSpacing: 0.5,
  },
  locationInput: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.text,
    paddingVertical: 4,
  },
  pinCircleGreen: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#E6F4EA",
    borderWidth: 2,
    borderColor: colors.success,
    alignItems: "center",
    justifyContent: "center",
  },
  innerDotGreen: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.success,
  },
  pinCircleBlack: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.ink,
    alignItems: "center",
    justifyContent: "center",
  },
  innerSquareWhite: {
    width: 7,
    height: 7,
    backgroundColor: "#FFFFFF",
    borderRadius: 1.5,
  },
  innerDotWhite: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#FFFFFF",
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
    backgroundColor: colors.line,
  },
  swapBtn: {
    marginLeft: 16,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.mist,
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
    color: colors.ink,
    letterSpacing: -0.4,
  },
  sectionSub: {
    fontSize: 13,
    color: colors.muted,
  },
  vehiclesGrid: {
    gap: 12,
    marginBottom: 20,
  },
  vehicleCard: {
    padding: 14,
    borderWidth: 1.5,
    borderColor: colors.line,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  vehicleCardSelected: {
    borderColor: colors.ink,
    backgroundColor: "#FFFFFF",
  },
  vehicleArtWrapper: {
    width: 90,
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
    color: colors.ink,
  },
  vehiclePrice: {
    fontSize: 16,
    fontWeight: "900",
    color: colors.ink,
  },
  vehicleSpecs: {
    fontSize: 12,
    color: colors.muted,
    marginTop: 4,
  },
  vehicleBestFor: {
    fontSize: 12,
    color: colors.text,
    fontWeight: "500",
    marginTop: 4,
  },
  helpersCard: {
    padding: 16,
    marginBottom: 16,
  },
  helpersTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: colors.ink,
  },
  helpersDesc: {
    fontSize: 13,
    color: colors.muted,
    lineHeight: 18,
    marginTop: 4,
    marginBottom: 14,
  },
  helpersOptionsRow: {
    flexDirection: "row",
    gap: 8,
  },
  helperOption: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 12,
    backgroundColor: colors.mist,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.line,
  },
  helperOptionActive: {
    backgroundColor: colors.ink,
    borderColor: colors.ink,
  },
  helperOptLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.text,
  },
  helperOptLabelActive: {
    color: "#FFFFFF",
  },
  helperOptExtra: {
    fontSize: 11,
    color: colors.muted,
    marginTop: 2,
  },
  helperOptExtraActive: {
    color: "rgba(255,255,255,0.7)",
  },
  fareCard: {
    padding: 16,
    gap: 8,
  },
  fareRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  fareLabel: {
    fontSize: 14,
    color: colors.muted,
  },
  fareValue: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
  },
  fareTotalRow: {
    borderTopWidth: 1,
    borderTopColor: colors.line,
    paddingTop: 10,
    marginTop: 4,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "800",
    color: colors.ink,
  },
  totalValue: {
    fontSize: 20,
    fontWeight: "900",
    color: colors.ink,
  },
  bottomBar: {
    borderTopWidth: 1,
    borderTopColor: colors.line,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 14,
  },
  navBar: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: colors.line,
    backgroundColor: "#FFFFFF",
    height: 58,
    alignItems: "center",
  },
  navItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
  },
  navText: {
    fontSize: 11,
    fontWeight: "600",
    color: colors.disabled,
  },
  navTextActive: {
    color: colors.ink,
    fontWeight: "800",
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: "900",
    color: colors.ink,
    letterSpacing: -0.7,
  },
  pageSub: {
    fontSize: 14,
    color: colors.muted,
    marginTop: 4,
    marginBottom: 20,
  },
  bookingItem: {
    padding: 16,
    gap: 10,
  },
  bookingItemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  bookingItemFare: {
    fontSize: 18,
    fontWeight: "900",
    color: colors.ink,
  },
  bookingTripRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  bookingAddr: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.text,
  },
  bookingVehicleInfo: {
    fontSize: 13,
    color: colors.muted,
    borderTopWidth: 1,
    borderTopColor: colors.line,
    paddingTop: 10,
    marginTop: 4,
  },
  profileCard: {
    padding: 24,
    alignItems: "center",
  },
  profileAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.ink,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: "900",
    color: "#FFFFFF",
  },
  profileName: {
    fontSize: 20,
    fontWeight: "800",
    color: colors.ink,
  },
  profilePhone: {
    fontSize: 14,
    color: colors.muted,
    marginTop: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: colors.muted,
  },
  menuRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 14,
  },
  menuText: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.text,
  },
  menuDivider: {
    height: 1,
    backgroundColor: colors.line,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
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
    backgroundColor: colors.line,
    alignSelf: "center",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: colors.ink,
    letterSpacing: -0.5,
  },
  modalSub: {
    fontSize: 14,
    color: colors.muted,
    marginTop: 4,
    marginBottom: 20,
  },
  modalSummary: {
    backgroundColor: colors.paper,
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
    color: colors.muted,
  },
  modalVal: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.text,
  },
  modalTotal: {
    borderTopWidth: 1,
    borderTopColor: colors.line,
    paddingTop: 10,
  },
  modalTotalLabel: {
    fontSize: 16,
    fontWeight: "800",
    color: colors.ink,
  },
  modalTotalVal: {
    fontSize: 20,
    fontWeight: "900",
    color: colors.ink,
  },
  modalButtons: {
    gap: 8,
  },
  successCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.line,
    marginTop: 20,
  },
  successIconBox: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.success,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  successHeading: {
    fontSize: 24,
    fontWeight: "900",
    color: colors.ink,
    letterSpacing: -0.6,
  },
  successSub: {
    fontSize: 15,
    color: colors.muted,
    textAlign: "center",
    lineHeight: 22,
    marginTop: 8,
    marginBottom: 20,
  },
  confirmedDetails: {
    width: "100%",
    backgroundColor: colors.paper,
    borderRadius: 14,
    padding: 16,
    gap: 10,
    marginBottom: 24,
  },
  confirmedRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  confirmedLabel: {
    fontSize: 14,
    color: colors.muted,
  },
  confirmedVal: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.text,
  },
  confirmedFare: {
    fontSize: 18,
    fontWeight: "900",
    color: colors.ink,
  },
});
