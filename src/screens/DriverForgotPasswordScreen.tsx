import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CheckCircle2, MailCheck } from "lucide-react-native";
import { useCarryAuth } from "../auth/AuthContext";
import { CarryButton, CarryField, CarryTopBar } from "../components/CarryUI";
import { colors } from "../theme/colors";

interface Props {
  onBack: () => void;
  onSuccess?: () => void;
}

export default function DriverForgotPasswordScreen({ onBack, onSuccess }: Props) {
  const { sendPasswordReset } = useCarryAuth();
  const [identifier, setIdentifier] = useState("murugan.s@gmail.com");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);

  const handleSend = async () => {
    if (!identifier.trim()) {
      setError("Please enter your registered mobile number or email.");
      return;
    }

    setLoading(true);
    setError(undefined);

    try {
      if (identifier.includes("@")) {
        await sendPasswordReset(identifier.trim());
      }
      setSubmitted(true);
    } catch (err: any) {
      // Still show success or handle error
      if (identifier.includes("@")) {
        setSubmitted(true);
      } else {
        setError("No driver account uses this number. Check the digits.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <CarryTopBar onBack={onBack} />
        <View style={styles.sentContainer}>
          <View style={styles.iconCircle}>
            <MailCheck size={28} color="#FFFFFF" />
          </View>

          <Text style={styles.sentTitle}>Check your inbox</Text>
          <Text style={styles.sentSub}>
            We sent a reset link to{" "}
            <Text style={styles.highlight}>{identifier}</Text>. It expires in 15
            minutes.
          </Text>

          <View style={styles.sentActions}>
            <CarryButton onPress={onBack} variant="primary">
              Back to log in
            </CarryButton>
            <CarryButton
              onPress={() => {
                Alert.alert("Link Resent", "A new reset link has been dispatched.");
              }}
              variant="secondary"
            >
              Resend link
            </CarryButton>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <CarryTopBar onBack={onBack} />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.title}>Reset your password</Text>
          <Text style={styles.sub}>
            Enter the mobile number or email on your driver account.
          </Text>

          <View style={styles.form}>
            <CarryField
              label="Mobile number or email"
              value={identifier}
              onChangeText={(text) => {
                setIdentifier(text);
                if (error) setError(undefined);
              }}
              placeholder="e.g. 9843127560 or name@carry.app"
              error={error}
              autoCapitalize="none"
              keyboardType="email-address"
            />

            <CarryButton
              onPress={handleSend}
              variant="primary"
              loading={loading}
              disabled={loading}
            >
              Send reset link
            </CarryButton>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 24,
  },
  title: {
    fontSize: 30,
    fontWeight: "900",
    color: colors.primaryBlack,
    letterSpacing: -0.8,
  },
  sub: {
    fontSize: 15,
    color: colors.secondaryText,
    lineHeight: 22,
    marginTop: 8,
    marginBottom: 28,
  },
  form: {
    gap: 20,
  },
  sentContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primaryBlack,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  sentTitle: {
    fontSize: 30,
    fontWeight: "900",
    color: colors.primaryBlack,
    letterSpacing: -0.8,
  },
  sentSub: {
    fontSize: 15,
    color: colors.secondaryText,
    lineHeight: 22,
    marginTop: 8,
    marginBottom: 32,
  },
  highlight: {
    fontWeight: "700",
    color: colors.primaryBlack,
  },
  sentActions: {
    gap: 12,
  },
});
