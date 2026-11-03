import React from "react";
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { colors } from "../../src/theme/colors";
import { useAuth } from "../../src/hooks/useAuth";
import { usersService } from "../../src/features/users/users.service";
import { portalStore } from "../../src/store/portal.store";

export default function ChoosePortalScreen() {
  const router = useRouter();
  const { user } = useAuth();

  const handleSelect = async (portal: "customer" | "driver") => {
    portalStore.setPortal(portal);
    if (user?.uid) {
      await usersService.switchPortal(user.uid, portal);
    }
    if (portal === "driver") {
      router.replace("/(driver)");
    } else {
      router.replace("/(customer)");
    }
  };

  const isDriverEligible =
    user?.roles?.includes("driver") && user?.driverVerificationStatus === "approved";

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Select Workspace</Text>
        <Text style={styles.subtitle}>Choose which portal you want to access</Text>

        <TouchableOpacity
          style={styles.card}
          activeOpacity={0.8}
          onPress={() => handleSelect("customer")}
        >
          <Text style={styles.cardIcon}>📦</Text>
          <View style={styles.cardInfo}>
            <Text style={styles.cardTitle}>Customer Portal</Text>
            <Text style={styles.cardDesc}>Book mini-trucks, manage shipments, track cargo</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.card, !isDriverEligible && styles.cardDisabled]}
          activeOpacity={0.8}
          onPress={() => {
            if (isDriverEligible) {
              handleSelect("driver");
            } else {
              router.push("/(driver)/registration/status");
            }
          }}
        >
          <Text style={styles.cardIcon}>🚚</Text>
          <View style={styles.cardInfo}>
            <Text style={styles.cardTitle}>Driver Portal</Text>
            <Text style={styles.cardDesc}>
              {isDriverEligible
                ? "View available loads, start trips, manage earnings"
                : "Driver application pending verification or not applied"}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  content: {
    padding: 24,
    justifyContent: "center",
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: colors.deepNavy,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    color: colors.secondaryText,
    marginBottom: 28,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    backgroundColor: colors.background,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: colors.border,
    marginBottom: 16,
  },
  cardDisabled: {
    opacity: 0.7,
  },
  cardIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  cardInfo: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.deepNavy,
    marginBottom: 4,
  },
  cardDesc: {
    fontSize: 13,
    color: colors.secondaryText,
    lineHeight: 18,
  },
});
