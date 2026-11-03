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
import { Mail, Phone, UserRound } from "lucide-react-native";
import { useCarryAuth } from "../auth/AuthContext";
import {
  CarryButton,
  CarryCheck,
  CarryField,
  CarryTopBar,
} from "../components/CarryUI";
import { colors } from "../theme/colors";

interface Props {
  onLogin: () => void;
  onSuccess?: () => void;
}

/**
 * Customer Registration Screen faithfully reproduced from Magic Patterns design
 * Frame ID: pBBWjr5E4SzmA8aXkrKATw
 */
export default function RegisterScreen({ onLogin, onSuccess }: Props) {
  const { register } = useCarryAuth();
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agree, setAgree] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async () => {
    if (!name.trim() || !mobile.trim() || !email.trim() || !password) {
      setError("Please fill in all details to create your account.");
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
    if (!agree) {
      setError("Please accept the Terms and Privacy Policy to continue.");
      return;
    }

    setError(null);
    try {
      setLoading(true);
      await register(name.trim(), email.trim(), password, mobile.trim());
      onSuccess?.();
    } catch (err: any) {
      setError(err?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <CarryTopBar
        title="Create your account"
        subtitle="It takes a minute. We’ll verify your mobile next."
        large
        onBack={onLogin}
      />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {error && (
            <View style={styles.errorAlert}>
              <View style={styles.errorIcon}>
                <Text style={styles.errorExclamation}>!</Text>
              </View>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <CarryField
            label="Full name"
            placeholder="Arun Kumar"
            value={name}
            onChangeText={(text) => {
              setName(text);
              if (error) setError(null);
            }}
            icon={<UserRound size={18} color={colors.muted} />}
          />

          <CarryField
            label="Mobile number"
            placeholder="98430 21765"
            prefix="+91"
            value={mobile}
            onChangeText={(text) => {
              setMobile(text);
              if (error) setError(null);
            }}
            keyboardType="phone-pad"
            hint="We’ll send booking updates to this number"
            icon={<Phone size={18} color={colors.muted} />}
          />

          <CarryField
            label="Email address"
            placeholder="arun.kumar@gmail.com"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              if (error) setError(null);
            }}
            keyboardType="email-address"
            autoCapitalize="none"
            icon={<Mail size={18} color={colors.muted} />}
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
            hint="Use at least 6 characters with letters and numbers"
          />

          <CarryField
            label="Confirm password"
            placeholder="Re-enter your password"
            value={confirmPassword}
            onChangeText={(text) => {
              setConfirmPassword(text);
              if (error) setError(null);
            }}
            password
          />

          <View style={styles.termsWrapper}>
            <CarryCheck
              checked={agree}
              onPress={() => setAgree((a) => !a)}
              label={
                <Text style={styles.termsLabel}>
                  I agree to CARRY’s{" "}
                  <Text style={styles.termsBold}>Terms</Text> and{" "}
                  <Text style={styles.termsBold}>Privacy Policy</Text>
                </Text>
              }
            />
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <CarryButton
            onPress={handleRegister}
            variant="primary"
            disabled={!agree}
            loading={loading}
          >
            Create account
          </CarryButton>

          <Text style={styles.loginRedirect}>
            Already have an account?{" "}
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
    paddingTop: 12,
    paddingBottom: 28,
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
  termsWrapper: {
    marginTop: 8,
    marginBottom: 16,
  },
  termsLabel: {
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
