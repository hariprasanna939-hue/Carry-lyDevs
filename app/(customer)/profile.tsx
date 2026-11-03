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

export default function CustomerProfileScreen() {
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
            <Text style={styles.avatarText}>
              {user?.fullName ? user.fullName[0].toUpperCase() : "C"}
            </Text>
          </View>
          <Text style={styles.name}>{user?.fullName || "Guest Customer"}</Text>
          <Text style={styles.contact}>{user?.phone || user?.email || "No contact info"}</Text>
        </View>

        <View style={styles.menu}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push("/(customer)/bookings")}
          >
            <Text style={styles.menuLabel}>📦 Order History</Text>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push("/(customer)/addresses")}
          >
            <Text style={styles.menuLabel}>📍 Saved Addresses</Text>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push("/(auth)/choose-portal")}
          >
            <Text style={styles.menuLabel}>🔄 Switch to Driver Portal</Text>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push("/(shared)/support")}
          >
            <Text style={styles.menuLabel}>💬 Help & Support</Text>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push("/(shared)/settings")}
          >
            <Text style={styles.menuLabel}>⚙️ Settings</Text>
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
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  avatarText: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "800",
  },
  name: {
    fontSize: 20,
    fontWeight: "800",
    color: colors.deepNavy,
  },
  contact: {
    fontSize: 14,
    color: colors.secondaryText,
    marginTop: 4,
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
