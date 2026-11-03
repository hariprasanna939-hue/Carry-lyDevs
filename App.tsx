import React, { useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { AuthProvider, useCarryAuth } from "./src/auth/AuthContext";
import { CarryLogo } from "./src/components/CarryLogo";
import CustomerHomeScreen from "./src/screens/CustomerHomeScreen";
import CustomerOnboardingScreen from "./src/screens/CustomerOnboardingScreen";
import CustomerWelcomeScreen from "./src/screens/CustomerWelcomeScreen";
import DriverHomeScreen from "./src/screens/DriverHomeScreen";
import DriverLoginScreen from "./src/screens/DriverLoginScreen";
import DriverRegisterScreen from "./src/screens/DriverRegisterScreen";
import DriverWelcomeScreen from "./src/screens/DriverWelcomeScreen";
import LoginScreen from "./src/screens/LoginScreen";
import PortalScreen from "./src/screens/PortalScreen";
import RegisterScreen from "./src/screens/RegisterScreen";
import { colors } from "./src/theme/colors";

type ScreenMode =
  | "customer_home"
  | "customer_welcome"
  | "customer_onboarding"
  | "customer_login"
  | "customer_register"
  | "driver_welcome"
  | "driver_login"
  | "driver_register"
  | "driver_home"
  | "portal_selector";

function AppContent() {
  const { firebaseUser, profile, loading } = useCarryAuth();
  const [screenMode, setScreenMode] = useState<ScreenMode>("customer_home");

  if (loading) {
    return (
      <View style={styles.loading}>
        <CarryLogo size={36} tone="dark" variant="wheel" />
        <ActivityIndicator
          size="small"
          color={colors.ink}
          style={{ marginTop: 20 }}
        />
        <Text style={styles.loadingText}>Connecting to CARRY…</Text>
      </View>
    );
  }

  // Account suspended check
  if (profile && profile.accountStatus !== "active") {
    return (
      <View style={styles.loading}>
        <Text style={styles.errorTitle}>Account unavailable</Text>
        <Text style={styles.loadingText}>
          Contact CARRY support for assistance.
        </Text>
      </View>
    );
  }

  // Explicit Screen Mode overrides:
  // 1. Portal Selector
  if (screenMode === "portal_selector") {
    return <PortalScreen onSelected={() => setScreenMode("customer_home")} />;
  }

  // 2. Customer Welcome
  if (screenMode === "customer_welcome") {
    return (
      <CustomerWelcomeScreen
        onGetStarted={() => setScreenMode("customer_onboarding")}
        onLogin={() => setScreenMode("customer_login")}
        onSwitchToDriver={() => setScreenMode("driver_welcome")}
      />
    );
  }

  // 3. Customer Onboarding
  if (screenMode === "customer_onboarding") {
    return (
      <CustomerOnboardingScreen
        onFinish={() => setScreenMode("customer_home")}
        onSkip={() => setScreenMode("customer_home")}
      />
    );
  }

  // 4. Customer Login
  if (screenMode === "customer_login") {
    return (
      <LoginScreen
        onRegister={() => setScreenMode("customer_register")}
        onSuccess={() => setScreenMode("customer_home")}
      />
    );
  }

  // 5. Customer Register
  if (screenMode === "customer_register") {
    return (
      <RegisterScreen
        onLogin={() => setScreenMode("customer_login")}
        onSuccess={() => setScreenMode("customer_home")}
      />
    );
  }

  // 6. Driver Welcome
  if (screenMode === "driver_welcome") {
    return (
      <DriverWelcomeScreen
        onCreate={() => setScreenMode("driver_register")}
        onLogin={() => setScreenMode("driver_login")}
        onSwitchPortal={() => setScreenMode("customer_home")}
      />
    );
  }

  // 7. Driver Register
  if (screenMode === "driver_register") {
    return (
      <DriverRegisterScreen
        onBack={() => setScreenMode("driver_welcome")}
        onLogin={() => setScreenMode("driver_login")}
        onSuccess={() => setScreenMode("driver_home")}
      />
    );
  }

  // 8. Driver Login
  if (screenMode === "driver_login") {
    return (
      <DriverLoginScreen
        onBack={() => setScreenMode("driver_welcome")}
        onCreate={() => setScreenMode("driver_register")}
        onSuccess={() => setScreenMode("driver_home")}
      />
    );
  }

  // 9. Driver Home
  if (screenMode === "driver_home") {
    return (
      <DriverHomeScreen
        onSwitchPortal={() => setScreenMode("customer_home")}
      />
    );
  }

  // If user is logged in with active driver portal
  const approvedDriver =
    profile &&
    profile.roles.includes("driver") &&
    profile.driverVerificationStatus === "approved";

  if (profile && profile.activePortal === "driver" && approvedDriver) {
    return (
      <DriverHomeScreen
        onSwitchPortal={() => setScreenMode("portal_selector")}
      />
    );
  }

  // Default: Customer Home Screen
  return (
    <CustomerHomeScreen
      onSwitchPortal={() => {
        if (!firebaseUser) {
          setScreenMode("driver_welcome");
        } else {
          setScreenMode("portal_selector");
        }
      }}
      onOpenAuth={() => setScreenMode("customer_login")}
    />
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    backgroundColor: colors.paper,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  loadingText: {
    color: colors.muted,
    textAlign: "center",
    marginTop: 12,
    fontSize: 14,
  },
  errorTitle: {
    fontSize: 22,
    color: colors.text,
    fontWeight: "800",
    textAlign: "center",
  },
});
