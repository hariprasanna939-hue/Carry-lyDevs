import React, { useState } from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { AuthProvider, useCarryAuth } from "./src/auth/AuthContext";
import LoginScreen from "./src/screens/LoginScreen";
import RegisterScreen from "./src/screens/RegisterScreen";
import PortalScreen from "./src/screens/PortalScreen";
import CustomerHomeScreen from "./src/screens/CustomerHomeScreen";
import DriverHomeScreen from "./src/screens/DriverHomeScreen";
import { colors } from "./src/theme/colors";

function AppContent() {
  const { firebaseUser, profile, loading } = useCarryAuth();
  const [showRegister, setShowRegister] = useState(false);
  const [showPortalSelector, setShowPortalSelector] = useState(false);

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading CARRY...</Text>
      </View>
    );
  }

  if (!firebaseUser) {
    return showRegister ? (
      <RegisterScreen onLogin={() => setShowRegister(false)} />
    ) : (
      <LoginScreen onRegister={() => setShowRegister(true)} />
    );
  }

  if (!profile) {
    return (
      <View style={styles.loading}>
        <Text style={styles.errorTitle}>Profile unavailable</Text>
        <Text style={styles.loadingText}>
          Your account profile could not be loaded. Check your Firestore
          configuration and security rules.
        </Text>
      </View>
    );
  }

  if (profile.accountStatus !== "active") {
    return (
      <View style={styles.loading}>
        <Text style={styles.errorTitle}>Account unavailable</Text>
        <Text style={styles.loadingText}>
          Contact CARRY support for assistance.
        </Text>
      </View>
    );
  }

  if (showPortalSelector) {
    return <PortalScreen onSelected={() => setShowPortalSelector(false)} />;
  }

  const approvedDriver =
    profile.roles.includes("driver") &&
    profile.driverVerificationStatus === "approved";

  if (profile.activePortal === "driver" && approvedDriver) {
    return (
      <DriverHomeScreen
        onSwitchPortal={() => setShowPortalSelector(true)}
      />
    );
  }

  if (profile.activePortal === "customer") {
    return (
      <CustomerHomeScreen
        onSwitchPortal={() => setShowPortalSelector(true)}
      />
    );
  }

  return <PortalScreen onSelected={() => setShowPortalSelector(false)} />;
}

export default function App() {
  return (
    <AuthProvider>
      <SafeAreaView style={styles.safeArea}>
        <AppContent />
      </SafeAreaView>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loading: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
    padding: 28,
  },
  loadingText: {
    color: colors.secondaryText,
    textAlign: "center",
    marginTop: 12,
    lineHeight: 21,
  },
  errorTitle: {
    fontSize: 22,
    color: colors.text,
    fontWeight: "800",
    textAlign: "center",
  },
});
