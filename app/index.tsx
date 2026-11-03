import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../src/hooks/useAuth";
import { colors } from "../src/theme/colors";

export default function Index() {
  const router = useRouter();
  const { user, isAuthenticated, loading, logout, refreshProfile } = useAuth();
  const [profileTimeout, setProfileTimeout] = useState(false);

  useEffect(() => {
    // Failsafe timer: if profile takes > 4s, trigger recovery option
    let timer: ReturnType<typeof setTimeout>;
    if (isAuthenticated && !user && loading) {
      timer = setTimeout(() => {
        setProfileTimeout(true);
      }, 4000);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isAuthenticated, user, loading]);

  useEffect(() => {
    if (loading) return;

    if (!isAuthenticated) {
      router.replace("/(auth)/login");
      return;
    }

    // Account status check
    if (user && user.accountStatus && user.accountStatus !== "active") {
      return; // Handled in render below
    }

    if (
      user?.activePortal === "driver" &&
      user.driverVerificationStatus === "approved"
    ) {
      router.replace("/(driver)");
    } else {
      router.replace("/(customer)");
    }
  }, [loading, isAuthenticated, user, router]);

  if (loading && !profileTimeout) {
    return (
      <View style={styles.container}>
        <Text style={styles.brand}>CARRY</Text>
        <ActivityIndicator size="large" color={colors.primary} style={styles.spinner} />
        <Text style={styles.text}>Starting CARRY Coimbatore...</Text>
      </View>
    );
  }

  // Account suspended state
  if (isAuthenticated && user && user.accountStatus && user.accountStatus !== "active") {
    return (
      <View style={styles.container}>
        <Text style={styles.brand}>CARRY</Text>
        <Text style={styles.errorTitle}>Account Unavailable</Text>
        <Text style={styles.errorDescription}>
          Your CARRY account is currently inactive or suspended. Please contact CARRY Coimbatore Support for assistance.
        </Text>
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => logout().then(() => router.replace("/(auth)/login"))}
        >
          <Text style={styles.actionBtnText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Profile timeout / recovery state
  if (profileTimeout && !user) {
    return (
      <View style={styles.container}>
        <Text style={styles.brand}>CARRY</Text>
        <Text style={styles.errorTitle}>Connecting to Profile</Text>
        <Text style={styles.errorDescription}>
          Taking longer than usual to retrieve your account profile.
        </Text>
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => {
            setProfileTimeout(false);
            refreshProfile().catch(() => {});
          }}
        >
          <Text style={styles.actionBtnText}>Retry</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionBtn, styles.secondaryBtn]}
          onPress={() => router.replace("/(customer)")}
        >
          <Text style={styles.secondaryBtnText}>Continue to Customer Portal</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.brand}>CARRY</Text>
      <ActivityIndicator size="large" color={colors.primary} style={styles.spinner} />
      <Text style={styles.text}>Starting CARRY...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  brand: {
    fontSize: 32,
    fontWeight: "900",
    color: colors.primary,
    letterSpacing: 2,
    marginBottom: 20,
  },
  spinner: {
    marginVertical: 14,
  },
  text: {
    color: colors.secondaryText,
    fontSize: 15,
    fontWeight: "500",
  },
  errorTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: colors.text,
    marginBottom: 10,
    textAlign: "center",
  },
  errorDescription: {
    fontSize: 15,
    color: colors.secondaryText,
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 22,
  },
  actionBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    minWidth: 200,
    alignItems: "center",
    marginVertical: 6,
  },
  actionBtnText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  secondaryBtn: {
    backgroundColor: "transparent",
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  secondaryBtnText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: "600",
  },
});
