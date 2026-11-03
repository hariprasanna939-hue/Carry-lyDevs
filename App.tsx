import React, { useState, useEffect } from "react";
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
import CustomerResetPasswordScreen from "./src/screens/CustomerResetPasswordScreen";
import CustomerSplashScreen from "./src/screens/CustomerSplashScreen";
import CustomerVerifyOTPScreen from "./src/screens/CustomerVerifyOTPScreen";
import CustomerWelcomeScreen from "./src/screens/CustomerWelcomeScreen";
import DriverForgotPasswordScreen from "./src/screens/DriverForgotPasswordScreen";
import DriverHomeScreen from "./src/screens/DriverHomeScreen";
import DriverLoginScreen from "./src/screens/DriverLoginScreen";
import DriverRegisterScreen from "./src/screens/DriverRegisterScreen";
import DriverVerifyOTPScreen from "./src/screens/DriverVerifyOTPScreen";
import DriverWelcomeScreen from "./src/screens/DriverWelcomeScreen";
import ForgotPasswordScreen from "./src/screens/ForgotPasswordScreen";
import LoginScreen from "./src/screens/LoginScreen";
import PortalScreen from "./src/screens/PortalScreen";
import RegisterScreen from "./src/screens/RegisterScreen";
import {
  completeOnboarding,
  isOnboardingCompleted,
} from "./src/features/onboarding/onboardingStorage";
import { colors } from "./src/theme/colors";

type PortalType = "customer" | "driver" | "portal_select";

type ScreenMode =
  // Customer screens
  | "splash"
  | "customer_welcome"
  | "customer_onboarding"
  | "customer_login"
  | "customer_register"
  | "customer_forgot"
  | "customer_otp"
  | "customer_reset"
  | "customer_home"
  // Driver screens
  | "driver_welcome"
  | "driver_login"
  | "driver_register"
  | "driver_forgot"
  | "driver_otp"
  | "driver_home"
  // Selector
  | "portal_select";

function MainNavigator() {
  const { firebaseUser, profile, loading, switchPortal } = useCarryAuth();
  const [portal, setPortal] = useState<PortalType>("customer");
  const [screenMode, setScreenMode] = useState<ScreenMode>("splash");
  const [tempDestination, setTempDestination] = useState("+91 98430 21765");
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState<
    boolean | null
  >(null);

  // Read AsyncStorage onboarding state on app mount
  useEffect(() => {
    let isMounted = true;
    isOnboardingCompleted().then((completed) => {
      if (isMounted) {
        setHasCompletedOnboarding(completed);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  // Sync initial portal from profile if user is logged in
  useEffect(() => {
    if (profile?.activePortal) {
      setPortal(profile.activePortal);
    }
  }, [profile?.activePortal]);

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
        onFinish={() => {
          // If already signed in, proceed directly to home
          if (firebaseUser) {
            setScreenMode(portal === "driver" ? "driver_home" : "customer_home");
            return;
          }

          // If driver portal, go to driver welcome
          if (portal === "driver") {
            setScreenMode("driver_welcome");
            return;
          }

          // If onboarding has already been completed, go straight to login
          if (hasCompletedOnboarding) {
            setScreenMode("customer_login");
          } else {
            // First install flow: Splash -> Welcome -> Onboarding
            setScreenMode("customer_welcome");
          }
        }}
      />
    );
  }

  // Portal Selector Screen
  if (screenMode === "portal_select") {
    return (
      <PortalScreen
        onSelectRole={async (role) => {
          await switchPortal(role);
          setPortal(role);
          setScreenMode(role === "driver" ? "driver_home" : "customer_home");
        }}
      />
    );
  }

  // ==========================================================
  // DRIVER SCREENS
  // ==========================================================
  if (portal === "driver") {
    if (screenMode === "driver_welcome") {
      return (
        <DriverWelcomeScreen
          onGetStarted={() => setScreenMode("driver_register")}
          onLogin={() => setScreenMode("driver_login")}
          onSwitchPortal={() => {
            setPortal("customer");
            setScreenMode("customer_welcome");
          }}
        />
      );
    }

    if (screenMode === "driver_login") {
      return (
        <DriverLoginScreen
          onBack={() => setScreenMode("driver_welcome")}
          onRegister={() => setScreenMode("driver_register")}
          onForgotPassword={() => setScreenMode("driver_forgot")}
          onSuccess={() => setScreenMode("driver_home")}
        />
      );
    }

    if (screenMode === "driver_register") {
      return (
        <DriverRegisterScreen
          onBack={() => setScreenMode("driver_welcome")}
          onLogin={() => setScreenMode("driver_login")}
          onSuccess={() => setScreenMode("driver_otp")}
        />
      );
    }

    if (screenMode === "driver_forgot") {
      return (
        <DriverForgotPasswordScreen
          onBack={() => setScreenMode("driver_login")}
          onSuccess={() => setScreenMode("driver_login")}
        />
      );
    }

    if (screenMode === "driver_otp") {
      return (
        <DriverVerifyOTPScreen
          onBack={() => setScreenMode("driver_register")}
          onSuccess={() => setScreenMode("driver_home")}
        />
      );
    }

    // Driver Home (4 Tabs: Home, Jobs, Earnings, Profile)
    return (
      <DriverHomeScreen
        onSwitchPortal={() => {
          setPortal("customer");
          setScreenMode("customer_home");
        }}
      />
    );
  }

  // ==========================================================
  // CUSTOMER SCREENS (FIRST-LAUNCH & AUTH FLOW)
  // ==========================================================

  // Step 2 in First-Launch: Welcome Screen
  if (screenMode === "customer_welcome") {
    return (
      <CustomerWelcomeScreen
        onGetStarted={() => setScreenMode("customer_onboarding")}
        onLogin={async () => {
          await completeOnboarding();
          setHasCompletedOnboarding(true);
          setScreenMode("customer_login");
        }}
      />
    );
  }

  // Step 3 in First-Launch: Onboarding 3-Slide Carousel
  if (screenMode === "customer_onboarding") {
    return (
      <CustomerOnboardingScreen
        onFinish={async () => {
          await completeOnboarding();
          setHasCompletedOnboarding(true);
          setScreenMode("customer_login");
        }}
        onSkip={async () => {
          await completeOnboarding();
          setHasCompletedOnboarding(true);
          setScreenMode("customer_login");
        }}
      />
    );
  }

  // Step 4: Login Screen
  if (screenMode === "customer_login") {
    return (
      <LoginScreen
        onRegister={() => setScreenMode("customer_register")}
        onForgotPassword={() => setScreenMode("customer_forgot")}
        onSuccess={() => setScreenMode("customer_home")}
      />
    );
  }

  // Step 5: Register Screen
  if (screenMode === "customer_register") {
    return (
      <RegisterScreen
        onLogin={() => setScreenMode("customer_login")}
        onSuccess={() => setScreenMode("customer_otp")}
      />
    );
  }

  // Forgot Password Screen
  if (screenMode === "customer_forgot") {
    return (
      <ForgotPasswordScreen
        onBack={() => setScreenMode("customer_login")}
        onSuccess={() => setScreenMode("customer_reset")}
      />
    );
  }

  // Reset Password Screen
  if (screenMode === "customer_reset") {
    return (
      <CustomerResetPasswordScreen
        onBack={() => setScreenMode("customer_login")}
        onSuccess={() => setScreenMode("customer_login")}
      />
    );
  }

  // OTP Verification Screen
  if (screenMode === "customer_otp") {
    return (
      <CustomerVerifyOTPScreen
        destination={tempDestination}
        onBack={() => setScreenMode("customer_register")}
        onSuccess={() => setScreenMode("customer_home")}
      />
    );
  }

  // Customer Home Dashboard (4 Tabs: Home, Bookings, Notifications, Profile)
  return (
    <CustomerHomeScreen
      onOpenAuth={() => setScreenMode("customer_login")}
      onSwitchPortal={() => {
        setPortal("driver");
        setScreenMode("driver_home");
      }}
    />
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <AuthProvider>
        <MainNavigator />
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
