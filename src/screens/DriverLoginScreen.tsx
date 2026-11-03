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
import {
  CarryButton,
  CarryCheck,
  CarryField,
  CarryTopBar,
} from "../components/CarryUI";
import ForgotPasswordScreen from "./ForgotPasswordScreen";
import { colors } from "../theme/colors";

type Props = {
  onBack: () => void;
  onCreate: () => void;
  onSuccess?: () => void;
};

/**
 * Driver Login Screen faithfully reproduced from Magic Patterns design
 * Frame ID: pAz7VvKwGxYuJkRoKrMiMt
 */
export default function DriverLoginScreen({
  onBack,
  onCreate,
  onSuccess,
}: Props) {
  const { login } = useCarryAuth();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForgot, setShowForgot] = useState(false);

  if (showForgot) {
    return <ForgotPasswordScreen onBack={() => setShowForgot(false)} />;
  }

  const handleLogin = async () => {
    if (!identifier.trim() || !password) {
      setError("Enter your driver email and password.");
      return;
    }
    setError(null);
    try {
      setLoading(true);
      await login(identifier.trim(), password);
      onSuccess?.();
    } catch (err: any) {
      setError(
        "That password doesn’t match this account. Try again or reset it."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <CarryTopBar onBack={onBack} />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <CarryLogo size={24} tone="dark" variant="crate" />
            <Text style={styles.heading}>Welcome back, driver</Text>
            <Text style={styles.subheading}>
              Log in to see job requests and your earnings.
            </Text>
          </View>

          {error && (
            <View style={styles.errorAlert}>
              <View style={styles.errorIcon}>
                <Text style={styles.errorExclamation}>!</Text>
              </View>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <View style={styles.form}>
            <CarryField
              label="Mobile number or email"
              placeholder="98431 27560 or driver@gmail.com"
              value={identifier}
              onChangeText={(text) => {
                setIdentifier(text);
                if (error) setError(null);
              }}
              prefix="+91"
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <CarryField
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (error) setError(null);
              }}
              password
            />

            <View style={styles.row}>
              <CarryCheck
                checked={remember}
                onPress={() => setRemember((r) => !r)}
                label="Remember me"
              />

              <Pressable
                onPress={() => setShowForgot(true)}
                style={styles.forgotBtn}
              >
                <Text style={styles.forgotText}>Forgot password?</Text>
              </Pressable>
            </View>

            <View style={styles.loginBtnWrapper}>
              <CarryButton
                onPress={handleLogin}
                variant="primary"
                loading={loading}
              >
                {loading ? "Logging in..." : "Log in"}
              </CarryButton>
            </View>
          </View>

          <View style={styles.dividerRow}>
            <View style={styles.line} />
            <Text style={styles.dividerLabel}>New to CARRY?</Text>
            <View style={styles.line} />
          </View>

          <CarryButton onPress={onCreate} variant="secondary">
            Create driver account
          </CarryButton>
        </ScrollView>
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
    paddingBottom: 32,
  },
  header: {
    marginTop: 12,
    marginBottom: 24,
  },
  heading: {
    fontSize: 32,
    fontWeight: "900",
    color: colors.ink,
    letterSpacing: -0.9,
    marginTop: 16,
  },
  subheading: {
    fontSize: 15,
    color: colors.muted,
    marginTop: 6,
  },
  errorAlert: {
    backgroundColor: "#FFFFFF",
    borderColor: colors.error,
    borderWidth: 1.5,
    borderRadius: 14,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 16,
  },
  errorIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.error,
    alignItems: "center",
    justifyContent: "center",
  },
  errorExclamation: {
    color: "#FFFFFF",
    fontWeight: "900",
    fontSize: 12,
  },
  errorText: {
    flex: 1,
    fontSize: 13,
    color: colors.text,
    lineHeight: 18,
  },
  form: {
    gap: 4,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 4,
  },
  forgotBtn: {
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  forgotText: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.text,
    textDecorationLine: "underline",
  },
  loginBtnWrapper: {
    marginTop: 16,
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 24,
    gap: 12,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: colors.line,
  },
  dividerLabel: {
    fontSize: 13,
    color: colors.muted,
  },
});
