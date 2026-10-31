import React, { useState } from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { AuthProvider, useCarryAuth } from "./src/auth/AuthContext";
import CustomerHomeScreen from "./src/screens/CustomerHomeScreen";
import DriverHomeScreen from "./src/screens/DriverHomeScreen";
import LoginScreen from "./src/screens/LoginScreen";
import PortalScreen from "./src/screens/PortalScreen";
import RegisterScreen from "./src/screens/RegisterScreen";
import { colors } from "./src/theme/colors";

function AppContent() {
  const { firebaseUser, profile, loading } = useCarryAuth();
  const [showRegister, setShowRegister] = useState(false);
  const [showPortalSelector, setShowPortalSelector] = useState(false);
  const [showAuthScreen, setShowAuthScreen] = useState(false);

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading CARRY...</Text>
      </View>
    );
  }

  // If user explicitly chose to sign in or register
  if (showAuthScreen && !firebaseUser) {
    return showRegister ? (
      <RegisterScreen onLogin={() => setShowRegister(false)} />
    ) : (
      <LoginScreen onRegister={() => setShowRegister(true)} />
    );
  }

  // If signed in but profile has suspended status
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

  // Portal selector view
  if (showPortalSelector && profile) {
    return <PortalScreen onSelected={() => setShowPortalSelector(false)} />;
  }

  // Driver Portal view (approved drivers only)
  const approvedDriver =
    profile &&
    profile.roles.includes("driver") &&
    profile.driverVerificationStatus === "approved";

  if (profile && profile.activePortal === "driver" && approvedDriver) {
    return (
      <DriverHomeScreen
        onSwitchPortal={() => setShowPortalSelector(true)}
      />
    );
  }

  // Customer Home Screen (works seamlessly for authenticated users and guests)
  return (
    <CustomerHomeScreen
      onSwitchPortal={() => {
        if (!firebaseUser) {
          setShowAuthScreen(true);
        } else {
          setShowPortalSelector(true);
        }
      }}
      onOpenAuth={() => setShowAuthScreen(true)}
    />
  );
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
