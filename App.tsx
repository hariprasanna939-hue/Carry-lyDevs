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
import { doc, getDoc } from "firebase/firestore";
import { AuthProvider, useCarryAuth } from "./src/auth/AuthContext";
import { auth, db } from "./src/firebase/firebase";
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
import DriverOnboardingScreen from "./src/screens/DriverOnboardingScreen";
import DriverPendingScreen from "./src/screens/DriverPendingScreen";
import DriverRegisterScreen from "./src/screens/DriverRegisterScreen";
import DriverVerifyOTPScreen from "./src/screens/DriverVerifyOTPScreen";
import DriverWelcomeScreen from "./src/screens/DriverWelcomeScreen";
import ForgotPasswordScreen from "./src/screens/ForgotPasswordScreen";
import LoginScreen from "./src/screens/LoginScreen";
import RegisterScreen from "./src/screens/RegisterScreen";
import {
  completeOnboarding,
  getSelectedRole,
  isOnboardingCompleted,
} from "./src/features/onboarding/onboardingStorage";
import { driverOnboardingService } from "./src/services/driver-onboarding.service";
import { CarryUser } from "./src/types/user";
import { colors } from "./src/theme/colors";

type PortalType = "customer" | "driver";

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
  | "driver_onboarding"
  | "driver_pending"
  | "driver_home";

export function MainNavigator() {
  const { firebaseUser, profile, loading, logout } = useCarryAuth();
  const [portal, setPortal] = useState<PortalType>("customer");
  const [screenMode, setScreenMode] = useState<ScreenMode>("splash");
  const [tempDestination, setTempDestination] = useState("+91 98430 21765");
  const [onboardingSlideIndex, setOnboardingSlideIndex] = useState(0);
  const [, setHasCompletedOnboarding] = useState<boolean | null>(null);

  // Read AsyncStorage onboarding and saved role preference on mount
  useEffect(() => {
    let isMounted = true;
    Promise.all([isOnboardingCompleted(), getSelectedRole()]).then(
      ([completed, savedRole]) => {
        if (!isMounted) return;
        setHasCompletedOnboarding(completed);
        if (savedRole === "driver" || savedRole === "customer") {
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
    if (profile?.activePortal === "driver" || profile?.activePortal === "customer") {
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
          // If already signed in, check role and route to home, pending, or onboarding
          if (firebaseUser) {
            try {
              const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
              const userData = userDoc.data() as CarryUser | undefined;
              const roles = userData?.roles || [];
              const driverStatus = userData?.driverVerificationStatus || "not_applied";

              if (roles.includes("driver")) {
                setPortal("driver");
                if (driverStatus === "approved") {
                  setScreenMode("driver_home");
                } else if (driverStatus === "pending") {
                  setScreenMode("driver_pending");
                } else {
                  setScreenMode("driver_onboarding");
                }
                return;
              }

              // Customer user
              setPortal("customer");
              setScreenMode("customer_home");
              return;
            } catch {
              setScreenMode("customer_home");
              return;
            }
          }

          // First-launch & unauthenticated experience: Splash -> Welcome -> Onboarding
          setScreenMode("customer_welcome");
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
        onBackToWelcome={() => setScreenMode("customer_welcome")}
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

  // ==========================================================
  // 5. DRIVER FLOW
  // ==========================================================
  if (portal === "driver") {
    if (screenMode === "driver_welcome") {
      return (
        <DriverWelcomeScreen
          onGetStarted={() => setScreenMode("driver_register")}
          onLogin={() => setScreenMode("driver_login")}
        />
      );
    }

    if (screenMode === "driver_login") {
      return (
        <DriverLoginScreen
          onBack={() => setScreenMode("choose_role")}
          onRegister={() => setScreenMode("driver_register")}
          onForgotPassword={() => setScreenMode("driver_forgot")}
          onSuccess={async () => {
            try {
              const currentUser = auth.currentUser;
              if (!currentUser) {
                setScreenMode("choose_role");
                return;
              }

              const userDoc = await getDoc(doc(db, "users", currentUser.uid));
              const data = userDoc.data() as CarryUser | undefined;
              const roles = data?.roles || [];
              const driverVerificationStatus =
                data?.driverVerificationStatus || "not_applied";

              // Check if user is purely a customer with no driver role or application
              const hasDriverRole = roles.includes("driver");
              const hasDriverApplication =
                driverVerificationStatus !== "not_applied";

              if (!hasDriverRole && !hasDriverApplication) {
                // Deny access: strictly enforce role separation
                Alert.alert(
                  "Customer Account Detected",
                  "This account is registered as a Customer account. Customers cannot access the Driver Portal.",
                  [
                    {
                      text: "Go to Customer Login",
                      onPress: async () => {
                        await logout();
                        setPortal("customer");
                        setScreenMode("customer_login");
                      },
                    },
                    {
                      text: "Cancel",
                      style: "cancel",
                      onPress: async () => {
                        await logout();
                        setScreenMode("choose_role");
                      },
                    },
                  ]
                );
                return;
              }

              // Approved driver -> Driver Dashboard
              if (driverVerificationStatus === "approved") {
                setScreenMode("driver_home");
                return;
              }

              // Check driver application in Firestore driverApplications/{uid}
              const appRecord =
                await driverOnboardingService.getDriverApplication(
                  currentUser.uid
                );

              if (
                appRecord.status === "SUBMITTED" ||
                appRecord.status === "UNDER_REVIEW" ||
                driverVerificationStatus === "pending"
              ) {
                setScreenMode("driver_pending");
              } else if (
                appRecord.status === "REJECTED" ||
                driverVerificationStatus === "rejected"
              ) {
                Alert.alert(
                  "Application Needs Attention",
                  "Your driver application was reviewed and requires updates. Please review your details and re-submit.",
                  [
                    {
                      text: "Update Application",
                      onPress: () => setScreenMode("driver_onboarding"),
                    },
                  ]
                );
              } else {
                // Draft or not completed -> Route to Driver Onboarding wizard!
                setScreenMode("driver_onboarding");
              }
            } catch (err) {
              console.error("Driver login routing error:", err);
              setScreenMode("driver_onboarding");
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
          onSuccess={() => {
            // Once OTP is verified for driver registration, route to driver onboarding wizard!
            setScreenMode("driver_onboarding");
          }}
        />
      );
    }

    // Driver 12-Step Onboarding Wizard Screen
    if (screenMode === "driver_onboarding") {
      return (
        <DriverOnboardingScreen
          onBack={() => setScreenMode("driver_login")}
          onSubmitted={() => {
            setScreenMode("driver_pending");
          }}
        />
      );
    }

    // Driver Pending Verification Screen ("Under Review")
    if (screenMode === "driver_pending") {
      return (
        <DriverPendingScreen
          onLogout={async () => {
            await logout();
            setScreenMode("choose_role");
          }}
        />
      );
    }

    // Driver Home (4 Tabs: Home, Jobs, Earnings, Profile)
    return <DriverHomeScreen />;
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
        onSuccess={async () => {
          try {
            const currentUser = auth.currentUser;
            if (!currentUser) {
              setScreenMode("choose_role");
              return;
            }

            const userDoc = await getDoc(doc(db, "users", currentUser.uid));
            const data = userDoc.data() as CarryUser | undefined;
            const roles = data?.roles || [];

            // If roles includes "customer", proceed to customer home
            if (roles.includes("customer")) {
              setPortal("customer");
              setScreenMode("customer_home");
            } else {
              // Deny access: User registered as Driver account only
              Alert.alert(
                "Driver Account Detected",
                "This account is registered as a Driver account. Please use Driver Login to access your driver portal.",
                [
                  {
                    text: "Go to Driver Login",
                    onPress: async () => {
                      await logout();
                      setPortal("driver");
                      setScreenMode("driver_login");
                    },
                  },
                  {
                    text: "Cancel",
                    style: "cancel",
                    onPress: async () => {
                      await logout();
                      setScreenMode("choose_role");
                    },
                  },
                ]
              );
            }
          } catch {
            setScreenMode("customer_home");
          }
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
