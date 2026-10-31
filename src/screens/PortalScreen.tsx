import React, { useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useCarryAuth } from "../auth/AuthContext";
import CarryButton from "../components/CarryButton";
import { colors } from "../theme/colors";

interface Props {
  onSelected?: () => void;
}

export default function PortalScreen({ onSelected }: Props) {
  const {
    profile,
    switchPortal,
    applyForDriver,
    logout,
  } = useCarryAuth();
  const [loading, setLoading] = useState(false);

  if (!profile) return null;

  const isApprovedDriver =
    profile.roles.includes("driver") &&
    profile.driverVerificationStatus === "approved";

  const handleSwitch = async (portal: "customer" | "driver") => {
    try {
      setLoading(true);
      await switchPortal(portal);
      if (onSelected) {
        onSelected();
      }
    } catch (error: any) {
      Alert.alert(
        "Portal unavailable",
        error?.message || "Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDriverApplication = async () => {
    try {
      setLoading(true);
      await applyForDriver();
      Alert.alert(
        "Application submitted",
        "Your driver application is now pending verification."
      );
    } catch (error: any) {
      Alert.alert(
        "Application failed",
        error?.message || "Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      style={styles.flex}
      contentContainerStyle={styles.container}
    >
      <Text style={styles.brand}>carry</Text>
      <Text style={styles.greeting}>
        Hello, {profile.fullName}
      </Text>
      <Text style={styles.subtitle}>
        How would you like to use CARRY today?
      </Text>

      <Pressable
        style={[styles.portalCard, styles.customerCard]}
        onPress={() => handleSwitch("customer")}
        disabled={loading}
      >
        <View style={styles.iconBox}>
          <Text style={styles.icon}>📦</Text>
        </View>
        <Text style={styles.cardTitle}>Customer portal</Text>
        <Text style={styles.cardDescription}>
          Book a van, move your goods and track your booking.
        </Text>
        <Text style={styles.cardAction}>
          Continue as customer →
        </Text>
      </Pressable>

      {isApprovedDriver ? (
        <Pressable
          style={[styles.portalCard, styles.driverCard]}
          onPress={() => handleSwitch("driver")}
          disabled={loading}
        >
          <View style={styles.iconBox}>
            <Text style={styles.icon}>🚚</Text>
          </View>
          <Text style={styles.cardTitle}>Driver portal</Text>
          <Text style={styles.cardDescription}>
            Manage jobs, trips and your earnings.
          </Text>
          <Text style={styles.driverAction}>
            Continue as driver →
          </Text>
        </Pressable>
      ) : (
        <View style={styles.portalCard}>
          <Text style={styles.cardTitle}>
            Become a CARRY driver
          </Text>
          {profile.driverVerificationStatus === "pending" ? (
            <>
              <Text style={styles.pending}>
                Application pending verification
              </Text>
              <Text style={styles.cardDescription}>
                Our operations team must verify your details before Driver Portal access is activated.
              </Text>
            </>
          ) : profile.driverVerificationStatus === "rejected" ? (
            <>
              <Text style={styles.rejected}>
                Application needs review
              </Text>
              <Text style={styles.cardDescription}>
                Contact CARRY support for the next steps.
              </Text>
            </>
          ) : (
            <>
              <Text style={styles.cardDescription}>
                Register your vehicle and documents to start receiving delivery requests.
              </Text>
              <CarryButton
                title="Apply to become a driver"
                onPress={handleDriverApplication}
                loading={loading}
              />
            </>
          )}
        </View>
      )}

      <Text style={styles.currentPortal}>
        Current portal: {profile.activePortal}
      </Text>

      <CarryButton title="Sign out" onPress={logout} secondary />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    padding: 23,
    paddingTop: 60,
    paddingBottom: 40,
  },
  brand: {
    fontSize: 32,
    fontWeight: "800",
    color: colors.primary,
  },
  greeting: {
    fontSize: 26,
    fontWeight: "800",
    color: colors.text,
    marginTop: 28,
  },
  subtitle: {
    color: colors.secondaryText,
    fontSize: 14,
    marginTop: 8,
    marginBottom: 25,
  },
  portalCard: {
    backgroundColor: colors.surface,
    borderRadius: 22,
    padding: 21,
    marginBottom: 17,
    borderWidth: 1,
    borderColor: colors.border,
  },
  customerCard: {
    backgroundColor: "#F8F6FF",
    borderColor: "#E4DFFF",
  },
  driverCard: {
    backgroundColor: "#F2F7FF",
    borderColor: "#DCE9FF",
  },
  iconBox: {
    width: 50,
    height: 50,
    borderRadius: 15,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  icon: {
    fontSize: 25,
  },
  cardTitle: {
    color: colors.text,
    fontSize: 19,
    fontWeight: "800",
  },
  cardDescription: {
    fontSize: 13,
    color: colors.secondaryText,
    lineHeight: 20,
    marginTop: 8,
    marginBottom: 15,
  },
  cardAction: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: "700",
  },
  driverAction: {
    fontSize: 14,
    color: "#2563EB",
    fontWeight: "700",
  },
  pending: {
    color: colors.warning,
    fontWeight: "700",
    marginTop: 12,
  },
  rejected: {
    color: colors.danger,
    fontWeight: "700",
    marginTop: 12,
  },
  currentPortal: {
    textAlign: "center",
    color: colors.secondaryText,
    fontSize: 12,
    marginTop: 7,
    marginBottom: 17,
    textTransform: "capitalize",
  },
});
