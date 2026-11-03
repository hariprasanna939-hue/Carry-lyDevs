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
import { authService } from "../../src/features/auth/auth.service";

export default function DriverProfileScreen() {
  const router = useRouter();
  const { user } = useAuth();

  const handleLogout = async () => {
    await authService.logout();
    router.replace("/(auth)/login");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.avatarSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>🚚</Text>
          </View>
          <Text style={styles.name}>{user?.fullName || "Driver Partner"}</Text>
          <Text style={styles.phone}>{user?.phone || user?.email}</Text>
          <View style={styles.statusPill}>
            <Text style={styles.statusPillText}>
              {user?.driverVerificationStatus === "approved" ? "VERIFIED PARTNER" : "PENDING VERIFICATION"}
            </Text>
          </View>
        </View>

        <View style={styles.menu}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push("/(driver)/registration/status")}
          >
            <Text style={styles.menuLabel}>📑 KYC & Vehicle Documents</Text>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push("/(driver)/earnings")}
          >
            <Text style={styles.menuLabel}>🏦 Bank Account & Payouts</Text>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push("/(shared)/support")}
          >
            <Text style={styles.menuLabel}>🛟 Driver Helpline & SOS</Text>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push("/(shared)/settings")}
          >
            <Text style={styles.menuLabel}>⚙️ App Settings</Text>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
        </View>

        <Button
          title="Sign Out"
          variant="outline"
          onPress={handleLogout}
          style={{ marginTop: 24 }}
        />
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
  avatarSection: {
    alignItems: "center",
    marginVertical: 20,
  },
  avatar: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: colors.driverTint,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  avatarText: {
    fontSize: 32,
  },
  name: {
    fontSize: 20,
    fontWeight: "800",
    color: colors.deepNavy,
  },
  phone: {
    fontSize: 14,
    color: colors.secondaryText,
    marginTop: 4,
  },
  statusPill: {
    backgroundColor: "#E6F7F0",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 10,
  },
  statusPillText: {
    fontSize: 11,
    fontWeight: "800",
    color: colors.success,
    letterSpacing: 0.5,
  },
  menu: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: colors.border,
    overflow: "hidden",
  },
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 18,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  menuLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.deepNavy,
  },
  chevron: {
    fontSize: 20,
    color: colors.secondaryText,
  },
});
