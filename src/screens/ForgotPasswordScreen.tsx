import React, { useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Mail, MailCheck } from "lucide-react-native";
import { CarryButton, CarryField, CarryTopBar } from "../components/CarryUI";
import { colors } from "../theme/colors";
import { useCarryAuth } from "../auth/AuthContext";

type Props = {
  onBack: () => void;
  onResetSent?: () => void;
  onSuccess?: () => void;
};

/**
 * Forgot Password Screen faithfully reproduced from Magic Patterns design
 * Frame ID: izCg2V2afuMAr83ap9YTzG
 */
export default function ForgotPasswordScreen({ onBack, onSuccess }: Props) {
  const { sendPasswordReset } = useCarryAuth();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSendReset = async () => {
    if (!email.trim() || !email.includes("@")) {
      setError("Enter a valid email address");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await sendPasswordReset(email.trim());
      setSent(true);
      if (onSuccess) {
        // Option to go directly to reset password test frame
      }
    } catch (err: any) {
      setError(err?.message || "Failed to send reset email. Verify address.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <CarryTopBar
        title={sent ? undefined : "Reset your password"}
        large
        onBack={onBack}
      />

      <View style={styles.container}>
        {sent ? (
          <View style={styles.sentContainer}>
            <View style={styles.iconCircle}>
              <MailCheck size={32} color="#FFFFFF" strokeWidth={2.2} />
            </View>

            <Text style={styles.sentHeading}>Check your inbox</Text>
            <Text style={styles.sentBody}>
              We sent a reset link to{" "}
              <Text style={styles.sentEmailBold}>{email}</Text>. It expires in 30
              minutes.
            </Text>

            <View style={styles.sentActions}>
              {onSuccess ? (
                <CarryButton onPress={onSuccess} variant="primary">
                  Set New Password Now
                </CarryButton>
              ) : (
                <CarryButton onPress={onBack} variant="primary">
                  Back to log in
                </CarryButton>
              )}
              <CarryButton
                onPress={() => setSent(false)}
                variant="ghost"
              >
                Send to a different email
              </CarryButton>
            </View>
          </View>
        ) : (
          <View style={styles.formContainer}>
            <Text style={styles.instruction}>
              Enter the email on your account and we’ll send you a link to set a
              new password.
            </Text>

            <CarryField
              label="Email address"
              placeholder="you@example.com"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (error) setError(null);
              }}
              keyboardType="email-address"
              autoCapitalize="none"
              error={error ?? undefined}
              icon={<Mail size={18} color={colors.muted} />}
            />

            <View style={styles.actionRow}>
              <CarryButton
                onPress={handleSendReset}
                variant="primary"
                loading={loading}
              >
                Send reset link
              </CarryButton>
            </View>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.paper,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  formContainer: {
    gap: 20,
  },
  instruction: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.muted,
  },
  actionRow: {
    marginTop: 12,
  },
  sentContainer: {
    paddingTop: 24,
    alignItems: "flex-start",
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: colors.ink,
    alignItems: "center",
    justifyContent: "center",
  },
  sentHeading: {
    marginTop: 24,
    fontSize: 30,
    fontWeight: "900",
    color: colors.ink,
    letterSpacing: -0.8,
  },
  sentBody: {
    marginTop: 12,
    fontSize: 15,
    lineHeight: 22,
    color: colors.muted,
  },
  sentEmailBold: {
    fontWeight: "700",
    color: colors.text,
  },
  sentActions: {
    width: "100%",
    marginTop: 36,
    gap: 12,
  },
});
