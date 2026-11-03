import React, { useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CheckCircle2, ChevronRight, Clock, ShieldCheck, Truck, User } from "lucide-react-native";
import { useCarryAuth } from "../auth/AuthContext";
import { CarryLogo } from "../components/CarryLogo";
import {
  CarryButton,
  CarryCard,
  CarryStatusTag,
  CarryTopBar,
} from "../components/CarryUI";
import { CarryVehicleArt } from "../components/CarryVehicleArt";
import { colors } from "../theme/colors";

interface Props {
  onSelected?: () => void;
}

export default function PortalScreen({ onSelected }: Props) {
  const { profile, switchPortal, applyForDriver, logout } = useCarryAuth();
  const [loading, setLoading] = useState(false);

  if (!profile) return null;

  const isApprovedDriver =
    profile.roles.includes("driver") &&
    profile.driverVerificationStatus === "approved";
  const isPendingDriver = profile.driverVerificationStatus === "pending";

  const handleSwitch = async (portal: "customer" | "driver") => {
    try {
      setLoading(true);
      await switchPortal(portal);
      onSelected?.();
    } catch (error: any) {
      Alert.alert("Portal Switch", error?.message || "Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDriverApplication = async () => {
    try {
      setLoading(true);
      await applyForDriver();
      Alert.alert(
        "Application Submitted",
        "Your driver application for Coimbatore is under review."
      );
    } catch (error: any) {
      Alert.alert("Application Failed", error?.message || "Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <CarryTopBar
        title="Choose Portal"
        subtitle={`Signed in as ${profile.fullName}`}
        onBack={onSelected}
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Customer Portal Card */}
        <CarryCard
          onPress={() => handleSwitch("customer")}
          style={[
            styles.portalCard,
            profile.activePortal === "customer" && styles.activePortalCard,
          ]}
        >
          <View style={styles.portalCardHeader}>
            <View style={styles.portalIconBox}>
              <User size={22} color={colors.ink} />
            </View>
            <View style={{ flex: 1 }}>
              <View style={styles.portalTitleRow}>
                <Text style={styles.portalTitle}>Customer Portal</Text>
                {profile.activePortal === "customer" && (
                  <CarryStatusTag tone="solid">Active</CarryStatusTag>
                )}
              </View>
              <Text style={styles.portalSub}>
                Book mini trucks, schedule moves, and track deliveries across Coimbatore.
              </Text>
            </View>
          </View>
        </CarryCard>

        {/* Driver Portal Card */}
        {isApprovedDriver ? (
          <CarryCard
            onPress={() => handleSwitch("driver")}
            style={[
              styles.portalCard,
              profile.activePortal === "driver" && styles.activePortalCard,
            ]}
          >
            <View style={styles.portalCardHeader}>
              <View style={styles.portalIconBox}>
                <Truck size={22} color={colors.ink} />
              </View>
              <View style={{ flex: 1 }}>
                <View style={styles.portalTitleRow}>
                  <Text style={styles.portalTitle}>Driver Portal</Text>
                  {profile.activePortal === "driver" ? (
                    <CarryStatusTag tone="solid">Active</CarryStatusTag>
                  ) : (
                    <CarryStatusTag tone="outline">Approved</CarryStatusTag>
                  )}
                </View>
                <Text style={styles.portalSub}>
                  Accept trip requests, view routes, and track daily earnings.
                </Text>
              </View>
            </View>
          </CarryCard>
        ) : isPendingDriver ? (
          <CarryCard style={styles.portalCard}>
            <View style={styles.portalCardHeader}>
              <View style={[styles.portalIconBox, { backgroundColor: colors.mist }]}>
                <Clock size={22} color={colors.muted} />
              </View>
              <View style={{ flex: 1 }}>
                <View style={styles.portalTitleRow}>
                  <Text style={styles.portalTitle}>Driver Portal</Text>
                  <CarryStatusTag tone="muted">Verification Pending</CarryStatusTag>
                </View>
                <Text style={styles.portalSub}>
                  Your RC and driving licence documents are being verified by the CARRY team.
                </Text>
              </View>
            </View>
          </CarryCard>
        ) : (
          <CarryCard style={styles.portalCard}>
            <View style={styles.portalCardHeader}>
              <View style={[styles.portalIconBox, { backgroundColor: colors.mist }]}>
                <Truck size={22} color={colors.ink} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.portalTitle}>Drive with CARRY</Text>
                <Text style={styles.portalSub}>
                  Earn on your schedule with your mini truck or pickup in Coimbatore.
                </Text>
              </View>
            </View>

            <View style={{ marginTop: 14 }}>
              <CarryButton
                onPress={handleDriverApplication}
                variant="primary"
                loading={loading}
              >
                Apply as Driver
              </CarryButton>
            </View>
          </CarryCard>
        )}

        <View style={styles.footerActions}>
          <CarryButton onPress={() => logout()} variant="ghost">
            Log Out
          </CarryButton>
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
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 32,
    gap: 16,
  },
  portalCard: {
    padding: 18,
    borderWidth: 1.5,
    borderColor: colors.line,
  },
  activePortalCard: {
    borderColor: colors.ink,
    borderWidth: 2,
  },
  portalCardHeader: {
    flexDirection: "row",
    gap: 14,
    alignItems: "flex-start",
  },
  portalIconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: colors.mist,
    alignItems: "center",
    justifyContent: "center",
  },
  portalTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  portalTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: colors.ink,
  },
  portalSub: {
    fontSize: 13,
    color: colors.muted,
    lineHeight: 18,
  },
  footerActions: {
    marginTop: 20,
    alignItems: "center",
  },
});
