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
import CustomerSplashScreen from "./src/screens/CustomerSplashScreen";
import CustomerWelcomeScreen from "./src/screens/CustomerWelcomeScreen";
import LoginScreen from "./src/screens/LoginScreen";
import RegisterScreen from "./src/screens/RegisterScreen";
import { colors } from "./src/theme/colors";

type CustomerScreenMode =
  | "splash"
  | "welcome"
  | "onboarding"
  | "login"
  | "register"
  | "home";

function CustomerAppRoot() {
  const { firebaseUser, profile, loading } = useCarryAuth();
  const [screenMode, setScreenMode] = useState<CustomerScreenMode>("splash");

  if (loading) {
    return (
      <View style={styles.loading}>
        <CarryLogo size={36} tone="dark" variant="wheel" />
        <ActivityIndicator
          size="small"
          color={colors.primaryBlack}
          style={{ marginTop: 20 }}
        />
        <Text style={styles.loadingText}>Connecting to CARRY…</Text>
      </View>
    );
  }

  // 1. Splash Screen
  if (screenMode === "splash") {
    return (
      <CustomerSplashScreen
        onFinish={() => setScreenMode(firebaseUser ? "home" : "welcome")}
      />
    );
  }

  // 2. Welcome Screen
  if (screenMode === "welcome") {
    return (
      <CustomerWelcomeScreen
        onGetStarted={() => setScreenMode("onboarding")}
        onLogin={() => setScreenMode("login")}
      />
    );
  }

  // 3. Onboarding Screen
  if (screenMode === "onboarding") {
    return (
      <CustomerOnboardingScreen
        onFinish={() => setScreenMode("home")}
        onSkip={() => setScreenMode("home")}
      />
    );
  }

  // 4. Customer Login Screen
  if (screenMode === "login") {
    return (
      <LoginScreen
        onRegister={() => setScreenMode("register")}
        onSuccess={() => setScreenMode("home")}
      />
    );
  }

  // 5. Customer Registration Screen
  if (screenMode === "register") {
    return (
      <RegisterScreen
        onLogin={() => setScreenMode("login")}
        onSuccess={() => setScreenMode("home")}
      />
    );
  }

  // 6. Customer Home Dashboard (Tabs: Home, Bookings, Notifications, Profile)
  return (
    <CustomerHomeScreen
      onOpenAuth={() => setScreenMode("login")}
    />
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <AuthProvider>
        <CustomerAppRoot />
      </AuthProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  loadingText: {
    color: colors.secondaryText,
    textAlign: "center",
    marginTop: 12,
    fontSize: 14,
  },
});
