import React, { useState, useEffect } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  AlertCircle,
  ArrowRight,
  Check,
  CheckCircle2,
  Clock,
  Compass,
  DollarSign,
  MapPin,
  Navigation,
  Phone,
  ShieldCheck,
  Truck,
  User,
} from "lucide-react-native";
import { useCarryAuth } from "../auth/AuthContext";
import { CarryLogo } from "../components/CarryLogo";
import { CarryMapPreview } from "../components/CarryMapPreview";
import {
  CarryButton,
  CarryCard,
  CarryStatusTag,
} from "../components/CarryUI";
import { CarryVehicleArt } from "../components/CarryVehicleArt";
import { colors } from "../theme/colors";

interface Props {
  onSwitchPortal: () => void;
}

type TripStage = "request" | "accepted" | "arrived_pickup" | "in_transit" | "completed";

export default function DriverHomeScreen({ onSwitchPortal }: Props) {
  const { profile, logout } = useCarryAuth();
  const [isOnline, setIsOnline] = useState(true);
  const [activeTripStage, setActiveTripStage] = useState<TripStage | null>("request");
  const [countdown, setCountdown] = useState(30);

  // Auto-countdown for new job request
  useEffect(() => {
    if (activeTripStage !== "request" || !isOnline) return;
    if (countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((c) => (c > 0 ? c - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [activeTripStage, isOnline, countdown]);

  const handleAcceptJob = () => {
    setActiveTripStage("accepted");
  };

  const handleDeclineJob = () => {
    setActiveTripStage(null);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top Driver Header */}
      <View style={styles.topHeader}>
        <View style={styles.topHeaderLeft}>
          <CarryLogo size={24} tone="dark" variant="crate" />
          <View style={styles.driverBadge}>
            <Text style={styles.driverBadgeText}>Driver</Text>
          </View>
        </View>

        <View style={styles.onlineToggleRow}>
          <Text
            style={[
              styles.onlineStatusText,
              { color: isOnline ? colors.success : colors.muted },
            ]}
          >
            {isOnline ? "Online" : "Offline"}
          </Text>
          <Switch
            value={isOnline}
            onValueChange={(val) => {
              setIsOnline(val);
              if (!val) setActiveTripStage(null);
            }}
            trackColor={{ false: colors.mist, true: colors.ink }}
            thumbColor="#FFFFFF"
          />
        </View>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Service Area Indicator */}
        <View style={styles.cityBanner}>
          <View style={styles.cityDot} />
          <Text style={styles.cityText}>
            Service Area: Coimbatore (Gandhipuram, Peelamedu, RS Puram, Singanallur)
          </Text>
        </View>

        {/* INCOMING MOVE REQUEST (when online and stage is request) */}
        {isOnline && activeTripStage === "request" && (
          <CarryCard style={styles.requestCard}>
            <View style={styles.requestHeader}>
              <View style={styles.requestBadge}>
                <Clock size={12} color="#FFFFFF" />
                <Text style={styles.requestBadgeText}>
                  NEW MOVE REQUEST • 0:{String(countdown).padStart(2, "0")}
                </Text>
              </View>
              <Text style={styles.requestPayout}>₹480</Text>
            </View>

            <Text style={styles.vehicleRequired}>
              Mini Truck (Tata Ace) • 8.4 km total
            </Text>

            <View style={styles.routeBox}>
              <View style={styles.routeRow}>
                <View style={styles.pinCircle}>
                  <View style={styles.innerDot} />
                </View>
                <View style={styles.routeTextCol}>
                  <Text style={styles.routeLabel}>PICKUP (1.2 km away)</Text>
                  <Text style={styles.routeAddr}>Gandhipuram Cross Cut Road</Text>
                </View>
              </View>

              <View style={styles.routeConnector} />

              <View style={styles.routeRow}>
                <View style={[styles.pinCircle, { borderColor: colors.ink }]}>
                  <View style={[styles.innerDot, { backgroundColor: colors.ink }]} />
                </View>
                <View style={styles.routeTextCol}>
                  <Text style={styles.routeLabel}>DROP DESTINATION</Text>
                  <Text style={styles.routeAddr}>Peelamedu, Near PSG Tech</Text>
                </View>
              </View>
            </View>

            <View style={styles.customerNotice}>
              <Text style={styles.customerNoticeText}>
                Customer requested: 1 Helper • Ground floor pickup
              </Text>
            </View>

            <View style={styles.requestActions}>
              <View style={{ flex: 1 }}>
                <CarryButton onPress={handleAcceptJob} variant="primary">
                  Accept Job (₹480)
                </CarryButton>
              </View>
              <View style={{ width: 100 }}>
                <CarryButton onPress={handleDeclineJob} variant="secondary">
                  Decline
                </CarryButton>
              </View>
            </View>
          </CarryCard>
        )}

        {/* ACTIVE TRIP NAVIGATION (when accepted) */}
        {activeTripStage && activeTripStage !== "request" && (
          <CarryCard style={styles.activeTripCard}>
            <View style={styles.activeTripHeader}>
              <CarryStatusTag tone="solid">Active Move</CarryStatusTag>
              <Text style={styles.activeTripFare}>₹480 Payout</Text>
            </View>

            <View style={{ marginVertical: 12 }}>
              <CarryMapPreview height={150} showRoute />
            </View>

            <View style={styles.customerCard}>
              <View style={styles.customerAvatar}>
                <Text style={styles.customerAvatarText}>A</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.customerName}>Arun Kumar</Text>
                <Text style={styles.customerRating}>★ 4.9 • 12 moves on CARRY</Text>
              </View>
              <Pressable
                onPress={() => Alert.alert("Calling Customer", "+91 98430 21765")}
                style={styles.callButton}
              >
                <Phone size={18} color="#FFFFFF" />
              </Pressable>
            </View>

            {/* Trip Progression Buttons */}
            <View style={{ marginTop: 16, gap: 10 }}>
              {activeTripStage === "accepted" && (
                <CarryButton
                  onPress={() => setActiveTripStage("arrived_pickup")}
                  variant="primary"
                >
                  Arrived at Pickup
                </CarryButton>
              )}
              {activeTripStage === "arrived_pickup" && (
                <CarryButton
                  onPress={() => setActiveTripStage("in_transit")}
                  variant="primary"
                >
                  Goods Loaded & Start Move
                </CarryButton>
              )}
              {activeTripStage === "in_transit" && (
                <CarryButton
                  onPress={() => {
                    setActiveTripStage("completed");
                    Alert.alert(
                      "Move Completed!",
                      "₹480 has been added to your daily earnings."
                    );
                  }}
                  variant="primary"
                >
                  Complete Move & Collect Fare
                </CarryButton>
              )}
              {activeTripStage === "completed" && (
                <CarryButton
                  onPress={() => setActiveTripStage(null)}
                  variant="secondary"
                >
                  Close & Ready for Next Job
                </CarryButton>
              )}
            </View>
          </CarryCard>
        )}

        {/* DRIVER STATS / TODAY'S METRICS */}
        <Text style={styles.sectionTitle}>Today's Earnings</Text>
        <View style={styles.metricsGrid}>
          <CarryCard style={styles.metricCard}>
            <Text style={styles.metricLabel}>Today's Payout</Text>
            <Text style={styles.metricVal}>₹1,840</Text>
            <Text style={styles.metricSub}>Direct to bank / UPI</Text>
          </CarryCard>

          <CarryCard style={styles.metricCard}>
            <Text style={styles.metricLabel}>Trips Done</Text>
            <Text style={styles.metricVal}>4</Text>
            <Text style={styles.metricSub}>All Coimbatore local</Text>
          </CarryCard>
        </View>

        {/* VERIFICATION & VEHICLE CARD */}
        <CarryCard style={styles.vehicleDocCard}>
          <View style={styles.vehicleDocRow}>
            <CarryVehicleArt type="mini" width={80} />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <View style={styles.verifiedRow}>
                <ShieldCheck size={18} color={colors.success} />
                <Text style={styles.verifiedText}>Documents Verified</Text>
              </View>
              <Text style={styles.vehicleModel}>Tata Ace Gold (TN 38 CD 4821)</Text>
              <Text style={styles.driverName}>
                Driver: {profile?.fullName || "Murugan Selvaraj"}
              </Text>
            </View>
          </View>
        </CarryCard>

        {/* PORTAL SWITCH ACTION */}
        <View style={styles.switchPortalWrapper}>
          <CarryButton onPress={onSwitchPortal} variant="secondary">
            Switch to Customer Portal
          </CarryButton>

          <Pressable onPress={() => logout()} style={styles.logoutBtn}>
            <Text style={styles.logoutText}>Log out of Driver Account</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.paper,
  },
  topHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  topHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  driverBadge: {
    marginLeft: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 99,
    backgroundColor: colors.ink,
  },
  driverBadgeText: {
    fontSize: 11,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  onlineToggleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  onlineStatusText: {
    fontSize: 13,
    fontWeight: "700",
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 36,
  },
  cityBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.line,
    marginBottom: 16,
  },
  cityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.success,
  },
  cityText: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.text,
  },
  requestCard: {
    borderColor: colors.ink,
    borderWidth: 2,
    padding: 18,
    marginBottom: 20,
  },
  requestHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  requestBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: colors.ink,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 99,
  },
  requestBadgeText: {
    fontSize: 11,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  requestPayout: {
    fontSize: 26,
    fontWeight: "900",
    color: colors.ink,
  },
  vehicleRequired: {
    fontSize: 13,
    color: colors.muted,
    marginTop: 6,
    marginBottom: 16,
  },
  routeBox: {
    backgroundColor: colors.paper,
    borderRadius: 14,
    padding: 14,
    gap: 6,
  },
  routeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  pinCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.success,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  innerDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.success,
  },
  routeTextCol: {
    flex: 1,
  },
  routeLabel: {
    fontSize: 10,
    fontWeight: "800",
    color: colors.muted,
    letterSpacing: 0.5,
  },
  routeAddr: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.text,
    marginTop: 2,
  },
  routeConnector: {
    width: 2,
    height: 14,
    backgroundColor: colors.line,
    marginLeft: 9,
  },
  customerNotice: {
    marginTop: 12,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  customerNoticeText: {
    fontSize: 13,
    color: colors.muted,
    fontWeight: "500",
  },
  requestActions: {
    flexDirection: "row",
    gap: 10,
  },
  activeTripCard: {
    padding: 18,
    marginBottom: 20,
    borderColor: colors.ink,
    borderWidth: 1.5,
  },
  activeTripHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  activeTripFare: {
    fontSize: 20,
    fontWeight: "900",
    color: colors.ink,
  },
  customerCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: colors.paper,
    padding: 12,
    borderRadius: 14,
  },
  customerAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.ink,
    alignItems: "center",
    justifyContent: "center",
  },
  customerAvatarText: {
    fontSize: 18,
    fontWeight: "900",
    color: "#FFFFFF",
  },
  customerName: {
    fontSize: 16,
    fontWeight: "800",
    color: colors.text,
  },
  customerRating: {
    fontSize: 12,
    color: colors.muted,
    marginTop: 2,
  },
  callButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.ink,
    alignItems: "center",
    justifyContent: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.ink,
    marginBottom: 12,
    letterSpacing: -0.4,
  },
  metricsGrid: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 18,
  },
  metricCard: {
    flex: 1,
    padding: 16,
  },
  metricLabel: {
    fontSize: 12,
    color: colors.muted,
    fontWeight: "600",
  },
  metricVal: {
    fontSize: 26,
    fontWeight: "900",
    color: colors.ink,
    marginVertical: 4,
  },
  metricSub: {
    fontSize: 11,
    color: colors.muted,
  },
  vehicleDocCard: {
    padding: 16,
    marginBottom: 24,
  },
  vehicleDocRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  verifiedRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 4,
  },
  verifiedText: {
    fontSize: 12,
    fontWeight: "800",
    color: colors.success,
  },
  vehicleModel: {
    fontSize: 15,
    fontWeight: "800",
    color: colors.ink,
  },
  driverName: {
    fontSize: 13,
    color: colors.muted,
    marginTop: 2,
  },
  switchPortalWrapper: {
    gap: 12,
    alignItems: "center",
  },
  logoutBtn: {
    paddingVertical: 8,
  },
  logoutText: {
    fontSize: 13,
    color: colors.error,
    fontWeight: "700",
  },
});
