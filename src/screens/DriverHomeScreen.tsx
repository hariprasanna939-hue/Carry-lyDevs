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
  Briefcase,
  Check,
  CheckCircle2,
  Clock,
  Compass,
  CreditCard,
  DollarSign,
  FileText,
  HelpCircle,
  Home,
  IndianRupee,
  LogOut,
  MapPin,
  Navigation,
  Phone,
  Settings,
  ShieldCheck,
  TrendingUp,
  Truck,
  User,
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
import { CarryVehicleArt } from "../components/CarryVehicleArt";
import { colors } from "../theme/colors";

interface Props {}

type DriverTab = "home" | "jobs" | "earnings" | "profile";
type TripStage = "request" | "accepted" | "arrived_pickup" | "in_transit" | "completed";

interface PastJob {
  id: string;
  vehicle: string;
  pickup: string;
  drop: string;
  fare: number;
  time: string;
  method: "Cash" | "UPI";
}

const PAST_JOBS: PastJob[] = [
  {
    id: "J-8921",
    vehicle: "Mini Truck (Tata Ace)",
    pickup: "Gandhipuram Cross Cut Rd",
    drop: "Peelamedu, Near PSG Tech",
    fare: 480,
    time: "Today, 2:15 PM",
    method: "Cash",
  },
  {
    id: "J-8919",
    vehicle: "Mini Truck (Tata Ace)",
    pickup: "RS Puram, DB Road",
    drop: "Saibaba Colony, NSR Road",
    fare: 360,
    time: "Today, 11:30 AM",
    method: "UPI",
  },
  {
    id: "J-8914",
    vehicle: "Bolero Pickup",
    pickup: "Singanallur Trichy Rd",
    drop: "Ganapathy Sathy Rd",
    fare: 620,
    time: "Yesterday, 5:45 PM",
    method: "UPI",
  },
  {
    id: "J-8902",
    vehicle: "Mini Truck (Tata Ace)",
    pickup: "Ukkadam Big Bazaar",
    drop: "Town Hall Market",
    fare: 380,
    time: "Yesterday, 1:10 PM",
    method: "Cash",
  },
];

export default function DriverHomeScreen({}: Props = {}) {
  const { profile, logout } = useCarryAuth();
  const [activeTab, setActiveTab] = useState<DriverTab>("home");
  const [isOnline, setIsOnline] = useState(true);
  const [activeTripStage, setActiveTripStage] = useState<TripStage | null>("request");
  const [countdown, setCountdown] = useState(30);
  const [jobsFilter, setJobsFilter] = useState<"all" | "active" | "completed">("all");
  const [earningsPeriod, setEarningsPeriod] = useState<"today" | "week" | "month">("today");

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

  const handleCashout = () => {
    Alert.alert(
      "Instant Cashout",
      "Transfer ₹1,840 to HDFC Bank (•••• 4892) immediately?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Confirm Transfer",
          onPress: () =>
            Alert.alert(
              "Payout Dispatched",
              "₹1,840 has been transferred to your registered account via IMPS."
            ),
        },
      ]
    );
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
              { color: isOnline ? colors.success : colors.secondaryText },
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
            trackColor={{ false: colors.lightGrey, true: colors.primaryBlack }}
            thumbColor="#FFFFFF"
          />
        </View>
      </View>

      {/* ======================================================== */}
      {/* TAB 1: HOME (DASHBOARD & ACTIVE JOB)                      */}
      {/* ======================================================== */}
      {activeTab === "home" && (
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Service Area Indicator */}
          <View style={styles.cityBanner}>
            <View
              style={[
                styles.cityDot,
                { backgroundColor: isOnline ? colors.success : colors.secondaryText },
              ]}
            />
            <Text style={styles.cityText}>
              Service Area: Coimbatore (Gandhipuram, Peelamedu, RS Puram)
            </Text>
          </View>

          {/* Offline Banner */}
          {!isOnline && (
            <CarryCard style={styles.offlineCard}>
              <Text style={styles.offlineTitle}>You are currently Offline</Text>
              <Text style={styles.offlineSub}>
                Toggle your status to Online in the top header to start receiving goods movement jobs in Coimbatore.
              </Text>
              <View style={{ marginTop: 12 }}>
                <CarryButton onPress={() => setIsOnline(true)} variant="primary">
                  Go Online Now
                </CarryButton>
              </View>
            </CarryCard>
          )}

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
                  <View style={[styles.pinCircle, { borderColor: colors.primaryBlack }]}>
                    <View
                      style={[
                        styles.innerDot,
                        { backgroundColor: colors.primaryBlack },
                      ]}
                    />
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

          {/* Quick Metrics */}
          <Text style={styles.sectionTitle}>Today's Snapshot</Text>
          <View style={styles.metricsGrid}>
            <CarryCard style={styles.metricCard}>
              <Text style={styles.metricLabel}>Today's Earnings</Text>
              <Text style={styles.metricVal}>₹1,840</Text>
              <Text style={styles.metricSub}>4 trips completed</Text>
            </CarryCard>

            <CarryCard style={styles.metricCard}>
              <Text style={styles.metricLabel}>Acceptance Rate</Text>
              <Text style={styles.metricVal}>96%</Text>
              <Text style={styles.metricSub}>Excellent rating</Text>
            </CarryCard>
          </View>

          {/* Quick Vehicle info */}
          <CarryCard style={styles.vehicleDocCard}>
            <View style={styles.vehicleDocRow}>
              <CarryVehicleArt type="mini" width={80} />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <View style={styles.verifiedRow}>
                  <ShieldCheck size={16} color={colors.success} />
                  <Text style={styles.verifiedText}>Verified Vehicle</Text>
                </View>
                <Text style={styles.vehicleModel}>Tata Ace Gold (TN 38 CD 4821)</Text>
                <Text style={styles.driverName}>
                  Driver: {profile?.fullName || "Murugan Selvaraj"}
                </Text>
              </View>
            </View>
          </CarryCard>
        </ScrollView>
      )}

      {/* ======================================================== */}
      {/* TAB 2: JOBS (REQUESTS, ACTIVE, HISTORY)                   */}
      {/* ======================================================== */}
      {activeTab === "jobs" && (
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.tabScreenTitle}>Job Activity</Text>

          {/* Filter Chips */}
          <View style={styles.filterRow}>
            <CarryChip
              label="All Jobs"
              active={jobsFilter === "all"}
              onPress={() => setJobsFilter("all")}
            />
            <CarryChip
              label="Active (1)"
              active={jobsFilter === "active"}
              onPress={() => setJobsFilter("active")}
            />
            <CarryChip
              label="Completed (4)"
              active={jobsFilter === "completed"}
              onPress={() => setJobsFilter("completed")}
            />
          </View>

          {/* Active Job preview if in progress */}
          {(jobsFilter === "all" || jobsFilter === "active") && activeTripStage && (
            <View style={{ marginBottom: 16 }}>
              <Text style={styles.subSectionTitle}>Current Active Move</Text>
              <CarryCard style={styles.activeJobPreviewCard}>
                <View style={styles.activeTripHeader}>
                  <CarryStatusTag tone="solid">In Progress</CarryStatusTag>
                  <Text style={styles.activeTripFare}>₹480</Text>
                </View>
                <Text style={styles.jobVehicle}>Tata Ace • Arun Kumar</Text>
                <Text style={styles.jobRoute}>
                  Gandhipuram → Peelamedu (PSG Tech)
                </Text>
                <View style={{ marginTop: 12 }}>
                  <CarryButton
                    onPress={() => setActiveTab("home")}
                    variant="primary"
                    size="sm"
                  >
                    View on Home Dashboard
                  </CarryButton>
                </View>
              </CarryCard>
            </View>
          )}

          {/* Past Jobs List */}
          {(jobsFilter === "all" || jobsFilter === "completed") && (
            <View>
              <Text style={styles.subSectionTitle}>Completed Moves</Text>
              <View style={{ gap: 12 }}>
                {PAST_JOBS.map((job) => (
                  <CarryCard key={job.id} style={styles.pastJobCard}>
                    <View style={styles.pastJobHeader}>
                      <View>
                        <Text style={styles.pastJobId}>{job.id}</Text>
                        <Text style={styles.pastJobTime}>{job.time}</Text>
                      </View>
                      <View style={{ alignItems: "flex-end" }}>
                        <Text style={styles.pastJobFare}>₹{job.fare}</Text>
                        <Text style={styles.pastJobMethod}>{job.method} Paid</Text>
                      </View>
                    </View>

                    <View style={styles.pastJobDivider} />

                    <View style={styles.pastJobLocations}>
                      <View style={styles.pastJobLocRow}>
                        <View style={styles.bulletDot} />
                        <Text style={styles.pastJobLocText}>{job.pickup}</Text>
                      </View>
                      <View style={styles.pastJobLocRow}>
                        <View
                          style={[
                            styles.bulletDot,
                            { backgroundColor: colors.primaryBlack },
                          ]}
                        />
                        <Text style={styles.pastJobLocText}>{job.drop}</Text>
                      </View>
                    </View>
                  </CarryCard>
                ))}
              </View>
            </View>
          )}
        </ScrollView>
      )}

      {/* ======================================================== */}
      {/* TAB 3: EARNINGS (DAILY, WEEKLY, PAYOUTS)                   */}
      {/* ======================================================== */}
      {activeTab === "earnings" && (
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.tabScreenTitle}>Earnings & Payouts</Text>

          {/* Period selector */}
          <View style={styles.filterRow}>
            <CarryChip
              label="Today"
              active={earningsPeriod === "today"}
              onPress={() => setEarningsPeriod("today")}
            />
            <CarryChip
              label="This Week"
              active={earningsPeriod === "week"}
              onPress={() => setEarningsPeriod("week")}
            />
            <CarryChip
              label="This Month"
              active={earningsPeriod === "month"}
              onPress={() => setEarningsPeriod("month")}
            />
          </View>

          {/* Earnings Hero Card */}
          <CarryCard style={styles.earningsHeroCard}>
            <Text style={styles.earningsHeroLabel}>
              {earningsPeriod === "today"
                ? "Today's Net Payout"
                : earningsPeriod === "week"
                ? "This Week's Net Payout"
                : "This Month's Net Payout"}
            </Text>
            <Text style={styles.earningsHeroVal}>
              {earningsPeriod === "today"
                ? "₹1,840"
                : earningsPeriod === "week"
                ? "₹10,590"
                : "₹42,800"}
            </Text>
            <Text style={styles.earningsHeroSub}>
              {earningsPeriod === "today"
                ? "4 trips • 0 cancellations"
                : earningsPeriod === "week"
                ? "24 trips • 98% acceptance"
                : "96 trips completed in Coimbatore"}
            </Text>

            <View style={styles.cashoutBtnWrapper}>
              <CarryButton onPress={handleCashout} variant="primary">
                Request Immediate Payout
              </CarryButton>
            </View>
          </CarryCard>

          {/* Bank Account Payout Info */}
          <Text style={styles.subSectionTitle}>Payout Method</Text>
          <CarryCard style={styles.bankCard}>
            <View style={styles.bankRow}>
              <View style={styles.bankIconCircle}>
                <CreditCard size={20} color={colors.primaryBlack} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.bankName}>HDFC Bank (•••• 4892)</Text>
                <Text style={styles.bankSub}>
                  Auto-settled every midnight via IMPS
                </Text>
              </View>
              <CarryStatusTag tone="outline">Verified</CarryStatusTag>
            </View>
          </CarryCard>

          {/* Weekly Summary Breakdown */}
          <Text style={styles.subSectionTitle}>Daily Breakdown (This Week)</Text>
          <CarryCard style={styles.breakdownCard}>
            {[
              { day: "Today (Wed)", trips: "4 trips", amount: "₹1,840" },
              { day: "Tue", trips: "5 trips", amount: "₹1,680" },
              { day: "Mon", trips: "3 trips", amount: "₹1,420" },
              { day: "Sun", trips: "6 trips", amount: "₹2,450" },
              { day: "Sat", trips: "4 trips", amount: "₹1,900" },
            ].map((d, index) => (
              <View key={d.day}>
                <View style={styles.breakdownRow}>
                  <View>
                    <Text style={styles.breakdownDay}>{d.day}</Text>
                    <Text style={styles.breakdownTrips}>{d.trips}</Text>
                  </View>
                  <Text style={styles.breakdownAmount}>{d.amount}</Text>
                </View>
                {index < 4 && <View style={styles.breakdownDivider} />}
              </View>
            ))}
          </CarryCard>
        </ScrollView>
      )}

      {/* ======================================================== */}
      {/* TAB 4: PROFILE (DOCUMENTS, VEHICLE, SETTINGS)              */}
      {/* ======================================================== */}
      {activeTab === "profile" && (
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.tabScreenTitle}>Driver Account</Text>

          {/* Driver identity card */}
          <CarryCard style={styles.driverProfileCard}>
            <View style={styles.driverAvatar}>
              <Text style={styles.driverAvatarText}>
                {profile?.fullName ? profile.fullName.charAt(0) : "M"}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.profileNameText}>
                {profile?.fullName || "Murugan Selvaraj"}
              </Text>
              <Text style={styles.profilePhoneText}>
                {profile?.phone || "+91 98431 27560"}
              </Text>
              <Text style={styles.profileRatingText}>★ 4.9 Driver Rating • 348 Moves</Text>
            </View>
          </CarryCard>

          {/* Vehicle Information */}
          <Text style={styles.subSectionTitle}>Assigned Vehicle</Text>
          <CarryCard style={styles.vehicleCard}>
            <View style={styles.vehicleRow}>
              <CarryVehicleArt type="mini" width={70} />
              <View style={{ flex: 1, marginLeft: 14 }}>
                <Text style={styles.vehicleNameText}>Tata Ace Gold</Text>
                <Text style={styles.vehiclePlateText}>TN 38 CD 4821</Text>
                <Text style={styles.vehicleSpecText}>Capacity: 750 kg • Mini Truck</Text>
              </View>
            </View>
          </CarryCard>

          {/* Documents Checklist */}
          <Text style={styles.subSectionTitle}>Verification & Compliance</Text>
          <CarryCard style={styles.docsCard}>
            {[
              { doc: "Commercial Driving Licence", valid: "Valid till Nov 2028" },
              { doc: "Vehicle RC Book", valid: "TN 38 CD 4821" },
              { doc: "Commercial Insurance", valid: "Valid till Dec 2026" },
              { doc: "Fitness Certificate (FC)", valid: "Valid till Oct 2027" },
            ].map((d, index) => (
              <View key={d.doc}>
                <View style={styles.docRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.docName}>{d.doc}</Text>
                    <Text style={styles.docValid}>{d.valid}</Text>
                  </View>
                  <View style={styles.docCheckCircle}>
                    <Check size={12} color="#FFFFFF" strokeWidth={3} />
                  </View>
                </View>
                {index < 3 && <View style={styles.breakdownDivider} />}
              </View>
            ))}
          </CarryCard>

          {/* Log out */}
          <View style={styles.portalActionSection}>
            <CarryButton
              onPress={() => {
                Alert.alert("Log Out", "Log out of your driver account?", [
                  { text: "Cancel", style: "cancel" },
                  { text: "Log Out", style: "destructive", onPress: () => logout() },
                ]);
              }}
              variant="secondary"
            >
              Log out of Driver Portal
            </CarryButton>
          </View>
        </ScrollView>
      )}

      {/* ======================================================== */}
      {/* FIXED DRIVER 4-TAB BOTTOM NAVIGATION                      */}
      {/* ======================================================== */}
      <View style={styles.bottomNav}>
        {/* Tab 1: Home */}
        <Pressable
          onPress={() => setActiveTab("home")}
          style={styles.navItem}
        >
          <Compass
            size={20}
            color={
              activeTab === "home" ? colors.primaryBlack : colors.disabledGrey
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

        {/* Tab 2: Jobs */}
        <Pressable
          onPress={() => setActiveTab("jobs")}
          style={styles.navItem}
        >
          <Briefcase
            size={20}
            color={
              activeTab === "jobs" ? colors.primaryBlack : colors.disabledGrey
            }
          />
          <Text
            style={[
              styles.navText,
              activeTab === "jobs" && styles.navTextActive,
            ]}
          >
            Jobs
          </Text>
          {activeTab === "jobs" && <View style={styles.activeTabIndicator} />}
        </Pressable>

        {/* Tab 3: Earnings */}
        <Pressable
          onPress={() => setActiveTab("earnings")}
          style={styles.navItem}
        >
          <IndianRupee
            size={20}
            color={
              activeTab === "earnings"
                ? colors.primaryBlack
                : colors.disabledGrey
            }
          />
          <Text
            style={[
              styles.navText,
              activeTab === "earnings" && styles.navTextActive,
            ]}
          >
            Earnings
          </Text>
          {activeTab === "earnings" && (
            <View style={styles.activeTabIndicator} />
          )}
        </Pressable>

        {/* Tab 4: Profile */}
        <Pressable
          onPress={() => setActiveTab("profile")}
          style={styles.navItem}
        >
          <User
            size={20}
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  topHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: colors.borderGrey,
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
    backgroundColor: colors.primaryBlack,
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
    paddingBottom: 24,
  },
  tabScreenTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: colors.primaryBlack,
    letterSpacing: -0.5,
    marginBottom: 16,
  },
  subSectionTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: colors.primaryBlack,
    marginTop: 16,
    marginBottom: 10,
    letterSpacing: -0.3,
  },
  filterRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
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
    borderColor: colors.borderGrey,
    marginBottom: 16,
  },
  cityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  cityText: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.mainText,
  },
  offlineCard: {
    padding: 18,
    marginBottom: 16,
  },
  offlineTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: colors.primaryBlack,
  },
  offlineSub: {
    fontSize: 13,
    color: colors.secondaryText,
    marginTop: 4,
    lineHeight: 18,
  },
  requestCard: {
    borderColor: colors.primaryBlack,
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
    backgroundColor: colors.primaryBlack,
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
    color: colors.primaryBlack,
  },
  vehicleRequired: {
    fontSize: 13,
    color: colors.secondaryText,
    marginTop: 6,
    marginBottom: 16,
  },
  routeBox: {
    backgroundColor: colors.background,
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
    color: colors.secondaryText,
    letterSpacing: 0.5,
  },
  routeAddr: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.mainText,
    marginTop: 2,
  },
  routeConnector: {
    width: 2,
    height: 14,
    backgroundColor: colors.borderGrey,
    marginLeft: 9,
  },
  customerNotice: {
    marginTop: 12,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  customerNoticeText: {
    fontSize: 13,
    color: colors.secondaryText,
    fontWeight: "500",
  },
  requestActions: {
    flexDirection: "row",
    gap: 10,
  },
  activeTripCard: {
    padding: 18,
    marginBottom: 20,
    borderColor: colors.primaryBlack,
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
    color: colors.primaryBlack,
  },
  customerCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: colors.background,
    padding: 12,
    borderRadius: 14,
  },
  customerAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primaryBlack,
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
    color: colors.mainText,
  },
  customerRating: {
    fontSize: 12,
    color: colors.secondaryText,
    marginTop: 2,
  },
  callButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primaryBlack,
    alignItems: "center",
    justifyContent: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.primaryBlack,
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
    color: colors.secondaryText,
    fontWeight: "600",
  },
  metricVal: {
    fontSize: 26,
    fontWeight: "900",
    color: colors.primaryBlack,
    marginVertical: 4,
  },
  metricSub: {
    fontSize: 11,
    color: colors.secondaryText,
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
    color: colors.primaryBlack,
  },
  driverName: {
    fontSize: 13,
    color: colors.secondaryText,
    marginTop: 2,
  },
  activeJobPreviewCard: {
    padding: 16,
  },
  jobVehicle: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.primaryBlack,
    marginTop: 8,
  },
  jobRoute: {
    fontSize: 13,
    color: colors.secondaryText,
    marginTop: 2,
  },
  pastJobCard: {
    padding: 16,
  },
  pastJobHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  pastJobId: {
    fontSize: 14,
    fontWeight: "800",
    color: colors.primaryBlack,
  },
  pastJobTime: {
    fontSize: 12,
    color: colors.secondaryText,
    marginTop: 2,
  },
  pastJobFare: {
    fontSize: 18,
    fontWeight: "900",
    color: colors.primaryBlack,
  },
  pastJobMethod: {
    fontSize: 11,
    color: colors.secondaryText,
    fontWeight: "600",
    marginTop: 2,
  },
  pastJobDivider: {
    height: 1,
    backgroundColor: colors.borderGrey,
    marginVertical: 12,
  },
  pastJobLocations: {
    gap: 6,
  },
  pastJobLocRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  bulletDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.secondaryText,
  },
  pastJobLocText: {
    fontSize: 13,
    color: colors.mainText,
    fontWeight: "500",
  },
  earningsHeroCard: {
    padding: 20,
    marginBottom: 16,
  },
  earningsHeroLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.secondaryText,
  },
  earningsHeroVal: {
    fontSize: 36,
    fontWeight: "900",
    color: colors.primaryBlack,
    letterSpacing: -1,
    marginVertical: 6,
  },
  earningsHeroSub: {
    fontSize: 13,
    color: colors.secondaryText,
  },
  cashoutBtnWrapper: {
    marginTop: 18,
  },
  bankCard: {
    padding: 16,
    marginBottom: 16,
  },
  bankRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  bankIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.lightGrey,
    alignItems: "center",
    justifyContent: "center",
  },
  bankName: {
    fontSize: 14,
    fontWeight: "800",
    color: colors.primaryBlack,
  },
  bankSub: {
    fontSize: 12,
    color: colors.secondaryText,
    marginTop: 2,
  },
  breakdownCard: {
    padding: 16,
    marginBottom: 24,
  },
  breakdownRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
  },
  breakdownDay: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.mainText,
  },
  breakdownTrips: {
    fontSize: 12,
    color: colors.secondaryText,
    marginTop: 2,
  },
  breakdownAmount: {
    fontSize: 15,
    fontWeight: "800",
    color: colors.primaryBlack,
  },
  breakdownDivider: {
    height: 1,
    backgroundColor: colors.borderGrey,
  },
  driverProfileCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 18,
    gap: 14,
    marginBottom: 16,
  },
  driverAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.primaryBlack,
    alignItems: "center",
    justifyContent: "center",
  },
  driverAvatarText: {
    fontSize: 22,
    fontWeight: "900",
    color: "#FFFFFF",
  },
  profileNameText: {
    fontSize: 17,
    fontWeight: "800",
    color: colors.primaryBlack,
  },
  profilePhoneText: {
    fontSize: 13,
    color: colors.secondaryText,
    marginTop: 2,
  },
  profileRatingText: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.mainText,
    marginTop: 4,
  },
  vehicleCard: {
    padding: 16,
    marginBottom: 16,
  },
  vehicleRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  vehicleNameText: {
    fontSize: 15,
    fontWeight: "800",
    color: colors.primaryBlack,
  },
  vehiclePlateText: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.mainText,
    marginTop: 2,
  },
  vehicleSpecText: {
    fontSize: 12,
    color: colors.secondaryText,
    marginTop: 2,
  },
  docsCard: {
    padding: 16,
    marginBottom: 24,
  },
  docRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  docName: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.mainText,
  },
  docValid: {
    fontSize: 12,
    color: colors.secondaryText,
    marginTop: 2,
  },
  docCheckCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.primaryBlack,
    alignItems: "center",
    justifyContent: "center",
  },
  portalActionSection: {
    gap: 16,
    alignItems: "center",
    marginBottom: 20,
  },
  driverLogoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 8,
  },
  driverLogoutText: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.error,
  },
  bottomNav: {
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
});
