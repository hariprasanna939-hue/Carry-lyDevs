import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCarryAuth } from "../auth/AuthContext";
import { CarryLogo } from "../components/CarryLogo";
import { CarryButton, CarryCheck, CarryField, CarryTopBar } from "../components/CarryUI";
import ForgotPasswordScreen from "./ForgotPasswordScreen";
import { colors } from "../theme/colors";

interface Props {
  onBack?: () => void;
  onRegister: () => void;
  onForgotPassword?: () => void;
  onSuccess?: () => void;
}

/**
 * Customer Login Screen faithfully reproduced from Magic Patterns design
 * Frame ID: e68mTGmeT1QVodDSsLsAEW
 */
export default function LoginScreen({
  onBack,
  onRegister,
  onForgotPassword,
  onSuccess,
}: Props) {
  const { login } = useCarryAuth();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const handleForgot = onForgotPassword || (() => setShowForgotPassword(true));

  if (showForgotPassword) {
    return <ForgotPasswordScreen onBack={() => setShowForgotPassword(false)} />;
  }

  const handleLogin = async () => {
    if (!identifier.trim() || !password) {
      setErrorMessage("Enter your email and password.");
      return;
    }
    setErrorMessage(null);
    try {
      setLoading(true);
      await login(identifier.trim(), password);
      onSuccess?.();
    } catch (error: any) {
      const code = error?.code || "";
      if (
        code.includes("wrong-password") ||
        code.includes("invalid-credential") ||
        code.includes("user-not-found")
      ) {
        setErrorMessage(
          "That password or email doesn’t match. Check it and try again, or reset it below."
        );
      } else {
        setErrorMessage(error?.message || "Failed to log in. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {onBack && <CarryTopBar onBack={onBack} />}
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <CarryLogo size={32} tone="dark" variant="wheel" />
            <Text style={styles.heading}>Welcome back</Text>
            <Text style={styles.subheading}>Log in to book and track your moves.</Text>
          </View>

          {errorMessage && (
            <View style={styles.errorAlert}>
              <View style={styles.errorIcon}>
                <Text style={styles.errorExclamation}>!</Text>
              </View>
              <Text style={styles.errorAlertText}>{errorMessage}</Text>
            </View>
          )}

          <View style={styles.form}>
            <CarryField
              label="Email or mobile number"
              placeholder="you@example.com or 98XXX XXXXX"
              value={identifier}
              onChangeText={(text) => {
                setIdentifier(text);
                if (errorMessage) setErrorMessage(null);
              }}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <CarryField
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (errorMessage) setErrorMessage(null);
              }}
              password
            />

            <View style={styles.rememberRow}>
              <CarryCheck
                checked={remember}
                onPress={() => setRemember((r) => !r)}
                label="Remember me"
              />

              <Pressable
                onPress={handleForgot}
                style={styles.forgotButton}
              >
                <Text style={styles.forgotText}>Forgot password?</Text>
              </Pressable>
            </View>

            <View style={styles.submitWrapper}>
              <CarryButton
                onPress={handleLogin}
                variant="primary"
                loading={loading}
              >
                {loading ? "Logging in…" : "Log in"}
              </CarryButton>
            </View>
          </View>

          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          <CarryButton
            onPress={() => {
              // Quick demo / OTP mode helper
              setIdentifier("customer@carry.app");
              setPassword("carry-2024");
            }}
            variant="secondary"
          >
            Quick demo fill (Coimbatore)
          </CarryButton>
        </ScrollView>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            New to CARRY?{" "}
            <Text onPress={onRegister} style={styles.footerLink}>
              Create an account
            </Text>
          </Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.paper,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 24,
  },
  header: {
    marginBottom: 24,
  },
  heading: {
    fontSize: 32,
    fontWeight: "900",
    color: colors.ink,
    letterSpacing: -0.9,
    marginTop: 20,
  },
  subheading: {
    fontSize: 16,
    color: colors.muted,
    marginTop: 6,
  },
  errorAlert: {
    backgroundColor: "#FFFFFF",
    borderColor: colors.error,
    borderWidth: 1.5,
    borderRadius: 16,
    padding: 14,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    marginBottom: 20,
  },
  errorIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.error,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },
  errorExclamation: {
    color: "#FFFFFF",
    fontWeight: "900",
    fontSize: 12,
  },
  errorAlertText: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  form: {
    marginTop: 4,
  },
  rememberRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 4,
  },
  forgotButton: {
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  forgotText: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.text,
    textDecorationLine: "underline",
  },
  submitWrapper: {
    marginTop: 16,
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 24,
    gap: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.line,
  },
  dividerText: {
    fontSize: 13,
    color: colors.muted,
  },
  footer: {
    paddingVertical: 18,
    paddingHorizontal: 24,
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: colors.line,
    backgroundColor: "#FFFFFF",
  },
  footerText: {
    fontSize: 15,
    color: colors.muted,
  },
  footerLink: {
    fontWeight: "800",
    color: colors.text,
    textDecorationLine: "underline",
  },
});
