import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCarryAuth } from "../auth/AuthContext";
import {
  CarryButton,
  CarryCheck,
  CarryField,
  CarryTopBar,
} from "../components/CarryUI";
import { colors } from "../theme/colors";

type Props = {
  onBack: () => void;
  onLogin: () => void;
  onSuccess?: () => void;
};

/**
 * Driver Registration Screen faithfully reproduced from Magic Patterns design
 * Frame ID: 11y6jUaptwrAMvjF8Yx3XU
 */
export default function DriverRegisterScreen({
  onBack,
  onLogin,
  onSuccess,
}: Props) {
  const { register } = useCarryAuth();
  const [fullName, setFullName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!fullName.trim() || !mobile.trim() || !email.trim() || !password) {
      setError("Please fill in all details.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords don’t match. Re-enter the same password.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (!acceptedTerms) {
      setError("You must agree to CARRY's Driver Terms to continue.");
      return;
    }

    setError(null);
    try {
      setLoading(true);
      await register(fullName.trim(), email.trim(), password, mobile.trim(), "driver");
      onSuccess?.();
    } catch (err: any) {
      setError(err?.message || "Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <CarryTopBar
        title="Create your driver account"
        subtitle="Driver account • Coimbatore"
        large
        onBack={onBack}
      />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.intro}>
            Takes two minutes. Vehicle and documents come next.
          </Text>

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
              label="Full name"
              placeholder="Murugan Selvaraj"
              value={fullName}
              onChangeText={(text) => {
                setFullName(text);
                if (error) setError(null);
              }}
              hint="As printed on your driving licence"
            />

            <CarryField
              label="Mobile number"
              placeholder="98431 27560"
              prefix="+91"
              value={mobile}
              onChangeText={(text) => {
                setMobile(text);
                if (error) setError(null);
              }}
              keyboardType="phone-pad"
              hint="We’ll send a 6-digit code to verify it"
            />

            <CarryField
              label="Email"
              placeholder="murugan.s@gmail.com"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (error) setError(null);
              }}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <CarryField
              label="Password"
              placeholder="At least 6 characters"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (error) setError(null);
              }}
              password
              hint="At least 6 characters, with letters and numbers"
            />

            <CarryField
              label="Confirm password"
              placeholder="Re-enter password"
              value={confirmPassword}
              onChangeText={(text) => {
                setConfirmPassword(text);
                if (error) setError(null);
              }}
              password
            />

            <View style={styles.termsWrapper}>
              <CarryCheck
                checked={acceptedTerms}
                onPress={() => setAcceptedTerms((t) => !t)}
                label={
                  <Text style={styles.termsText}>
                    I agree to CARRY’s{" "}
                    <Text style={styles.termsBold}>Driver Terms</Text> and{" "}
                    <Text style={styles.termsBold}>Privacy Policy</Text>
                  </Text>
                }
              />
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <CarryButton
            onPress={handleSubmit}
            variant="primary"
            disabled={!acceptedTerms}
            loading={loading}
          >
            Create account
          </CarryButton>

          <Text style={styles.loginRedirect}>
            Already registered?{" "}
            <Text onPress={onLogin} style={styles.loginLink}>
              Log in
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
    paddingTop: 8,
    paddingBottom: 28,
  },
  intro: {
    fontSize: 15,
    color: colors.muted,
    marginBottom: 20,
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
  termsWrapper: {
    marginTop: 6,
    marginBottom: 16,
  },
  termsText: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  termsBold: {
    fontWeight: "700",
    textDecorationLine: "underline",
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: colors.line,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 20,
  },
  loginRedirect: {
    textAlign: "center",
    fontSize: 14,
    color: colors.muted,
    marginTop: 12,
  },
  loginLink: {
    fontWeight: "800",
    color: colors.text,
    textDecorationLine: "underline",
  },
});
