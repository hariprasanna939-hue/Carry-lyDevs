import React, { useState, useEffect } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { AuthProvider, useCarryAuth } from "./src/auth/AuthContext";
import { CarryLogo } from "./src/components/CarryLogo";
import ChooseRoleScreen from "./src/screens/ChooseRoleScreen";
import CustomerHomeScreen from "./src/screens/CustomerHomeScreen";
import CustomerOnboardingScreen from "./src/screens/CustomerOnboardingScreen";
import CustomerResetPasswordScreen from "./src/screens/CustomerResetPasswordScreen";
import CustomerSplashScreen from "./src/screens/CustomerSplashScreen";
import CustomerVerifyOTPScreen from "./src/screens/CustomerVerifyOTPScreen";
import CustomerWelcomeScreen from "./src/screens/CustomerWelcomeScreen";
import DriverForgotPasswordScreen from "./src/screens/DriverForgotPasswordScreen";
import DriverHomeScreen from "./src/screens/DriverHomeScreen";
import DriverLoginScreen from "./src/screens/DriverLoginScreen";
import DriverPendingScreen from "./src/screens/DriverPendingScreen";
import DriverRegisterScreen from "./src/screens/DriverRegisterScreen";
import DriverVerifyOTPScreen from "./src/screens/DriverVerifyOTPScreen";
import DriverWelcomeScreen from "./src/screens/DriverWelcomeScreen";
import ForgotPasswordScreen from "./src/screens/ForgotPasswordScreen";
import LoginScreen from "./src/screens/LoginScreen";
import PortalScreen from "./src/screens/PortalScreen";
import RegisterScreen from "./src/screens/RegisterScreen";
import {
  completeOnboarding,
  getSelectedRole,
  isOnboardingCompleted,
  setSelectedRole,
} from "./src/features/onboarding/onboardingStorage";
import { colors } from "./src/theme/colors";

type PortalType = "customer" | "driver" | "portal_select";

type ScreenMode =
  // Intro & Role Selection
  | "splash"
  | "customer_welcome"
  | "customer_onboarding"
  | "choose_role"
  // Customer Authentication & Home
  | "customer_login"
  | "customer_register"
  | "customer_forgot"
  | "customer_otp"
  | "customer_reset"
  | "customer_home"
  // Driver Authentication & Portal
  | "driver_welcome"
  | "driver_login"
  | "driver_register"
  | "driver_forgot"
  | "driver_otp"
  | "driver_pending"
  | "driver_home"
  // Selector
  | "portal_select";

function MainNavigator() {
  const { firebaseUser, profile, loading, switchPortal, logout } = useCarryAuth();
  const [portal, setPortal] = useState<PortalType>("customer");
  const [screenMode, setScreenMode] = useState<ScreenMode>("splash");
  const [tempDestination, setTempDestination] = useState("+91 98430 21765");
  const [onboardingSlideIndex, setOnboardingSlideIndex] = useState(0);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState<
    boolean | null
  >(null);

  // Read AsyncStorage onboarding and saved role preference on mount
  useEffect(() => {
    let isMounted = true;
    Promise.all([isOnboardingCompleted(), getSelectedRole()]).then(
      ([completed, savedRole]) => {
        if (!isMounted) return;
        setHasCompletedOnboarding(completed);
        if (savedRole) {
          setPortal(savedRole);
        }
      }
    );
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

  // ==========================================================
  // 1. SPLASH SCREEN
  // ==========================================================
  if (screenMode === "splash") {
    return (
      <CustomerSplashScreen
        onFinish={async () => {
          // If already signed in, check role and route to home or pending
          if (firebaseUser) {
            if (portal === "driver") {
              if (profile?.driverVerificationStatus === "pending") {
                setScreenMode("driver_pending");
              } else {
                setScreenMode("driver_home");
              }
            } else {
              setScreenMode("customer_home");
            }
            return;
          }

          // If onboarding was already completed, go to login or choose role
          if (hasCompletedOnboarding) {
            const savedRole = await getSelectedRole();
            if (savedRole === "driver") {
              setPortal("driver");
              setScreenMode("driver_login");
            } else if (savedRole === "customer") {
              setPortal("customer");
              setScreenMode("customer_login");
            } else {
              setScreenMode("choose_role");
            }
          } else {
            // First-time app open: Splash -> Welcome -> Onboarding -> Choose Role
            setScreenMode("customer_welcome");
          }
        }}
      />
    );
  }

  // ==========================================================
  // 2. WELCOME SCREEN
  // ==========================================================
  if (screenMode === "customer_welcome") {
    return (
      <CustomerWelcomeScreen
        onGetStarted={() => {
          setOnboardingSlideIndex(0);
          setScreenMode("customer_onboarding");
        }}
        onLogin={async () => {
          await completeOnboarding();
          setHasCompletedOnboarding(true);
          setScreenMode("choose_role");
        }}
      />
    );
  }

  // ==========================================================
  // 3. ONBOARDING SCREEN (3 SLIDES)
  // ==========================================================
  if (screenMode === "customer_onboarding") {
    return (
      <CustomerOnboardingScreen
        initialSlide={onboardingSlideIndex}
        onFinish={async () => {
          await completeOnboarding();
          setHasCompletedOnboarding(true);
          setScreenMode("choose_role");
        }}
        onSkip={async () => {
          await completeOnboarding();
          setHasCompletedOnboarding(true);
          setScreenMode("choose_role");
        }}
      />
    );
  }

  // ==========================================================
  // 4. CHOOSE YOUR ROLE SCREEN (Customer vs Driver)
  // ==========================================================
  if (screenMode === "choose_role") {
    return (
      <ChooseRoleScreen
        onBack={() => {
          setOnboardingSlideIndex(2); // Go back to Onboarding 3
          setScreenMode("customer_onboarding");
        }}
        onContinue={(role) => {
          setPortal(role);
          if (role === "customer") {
            setScreenMode("customer_login");
          } else {
            setScreenMode("driver_login");
          }
        }}
      />
    );
  }

  // Portal Selector (Switching modal / screen)
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
  // 5. DRIVER FLOW
  // ==========================================================
  if (portal === "driver") {
    if (screenMode === "driver_welcome") {
      return (
        <DriverWelcomeScreen
          onGetStarted={() => setScreenMode("driver_register")}
          onLogin={() => setScreenMode("driver_login")}
          onSwitchPortal={() => {
            setPortal("customer");
            setScreenMode("choose_role");
          }}
        />
      );
    }

    if (screenMode === "driver_login") {
      return (
        <DriverLoginScreen
          onBack={() => setScreenMode("choose_role")}
          onRegister={() => setScreenMode("driver_register")}
          onForgotPassword={() => setScreenMode("driver_forgot")}
          onSuccess={() => {
            // Verify authenticated driver's actual Firestore status
            if (profile?.driverVerificationStatus === "pending") {
              setScreenMode("driver_pending");
            } else if (
              profile?.roles.includes("driver") &&
              profile?.driverVerificationStatus === "approved"
            ) {
              setScreenMode("driver_home");
            } else {
              // Account is customer or has not applied
              if (profile?.roles.includes("customer")) {
                Alert.alert(
                  "Driver Verification Required",
                  "You are logged in with a Customer account. To drive with CARRY, submit your vehicle and licence details.",
                  [
                    {
                      text: "Continue as Customer",
                      onPress: () => {
                        setPortal("customer");
                        setScreenMode("customer_home");
                      },
                    },
                    {
                      text: "View Pending Details",
                      onPress: () => setScreenMode("driver_pending"),
                    },
                  ]
                );
              } else {
                setScreenMode("driver_home");
              }
            }
          }}
        />
      );
    }

    if (screenMode === "driver_register") {
      return (
        <DriverRegisterScreen
          onBack={() => setScreenMode("driver_login")}
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
          onSuccess={() => setScreenMode("driver_pending")}
        />
      );
    }

    // Driver Pending Verification Screen
    if (screenMode === "driver_pending") {
      return (
        <DriverPendingScreen
          onSwitchToCustomer={() => {
            setPortal("customer");
            setScreenMode("customer_home");
          }}
          onLogout={async () => {
            await logout();
            setScreenMode("choose_role");
          }}
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
  // 6. CUSTOMER FLOW
  // ==========================================================
  if (screenMode === "customer_login") {
    return (
      <LoginScreen
        onBack={() => setScreenMode("choose_role")}
        onRegister={() => setScreenMode("customer_register")}
        onForgotPassword={() => setScreenMode("customer_forgot")}
        onSuccess={() => {
          setScreenMode("customer_home");
        }}
      />
    );
  }

  if (screenMode === "customer_register") {
    return (
      <RegisterScreen
        onLogin={() => setScreenMode("customer_login")}
        onSuccess={() => setScreenMode("customer_otp")}
      />
    );
  }

  if (screenMode === "customer_forgot") {
    return (
      <ForgotPasswordScreen
        onBack={() => setScreenMode("customer_login")}
        onSuccess={() => setScreenMode("customer_reset")}
      />
    );
  }

  if (screenMode === "customer_reset") {
    return (
      <CustomerResetPasswordScreen
        onBack={() => setScreenMode("customer_login")}
        onSuccess={() => setScreenMode("customer_login")}
      />
    );
  }

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
        if (profile?.driverVerificationStatus === "pending") {
          setScreenMode("driver_pending");
        } else {
          setScreenMode("driver_home");
        }
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
