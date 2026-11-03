import React, { useState } from "react";
import { StyleSheet, Text, View, SafeAreaView, Alert } from "react-native";
import { useRouter } from "expo-router";
import { colors } from "../../src/theme/colors";
import Button from "../../src/components/ui/Button";
import Input from "../../src/components/ui/Input";
import { authService } from "../../src/features/auth/auth.service";
import { isValidEmail } from "../../src/utils/validation";

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleReset = async () => {
    if (!isValidEmail(email)) {
      Alert.alert("Invalid Email", "Please enter a valid email address.");
      return;
    }

    try {
      setLoading(true);
      await authService.resetPassword(email);
      setSubmitted(true);
    } catch (err: any) {
      Alert.alert("Error", err?.message || "Failed to send reset link.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Reset Password</Text>
        <Text style={styles.subtitle}>
          Enter your registered email address and we will send you a password reset link.
        </Text>

        {submitted ? (
          <View style={styles.successBox}>
            <Text style={styles.successTitle}>Check your inbox</Text>
            <Text style={styles.successText}>
              We sent password reset instructions to {email}.
            </Text>
            <Button
              title="Back to Sign In"
              style={{ marginTop: 20 }}
              onPress={() => router.replace("/(auth)/login")}
            />
          </View>
        ) : (
          <>
            <Input
              label="Email Address"
              placeholder="name@example.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <Button
              title="Send Reset Link"
              size="large"
              loading={loading}
              onPress={handleReset}
              style={{ marginTop: 12 }}
            />
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  content: {
    padding: 24,
    justifyContent: "center",
    flex: 1,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: colors.deepNavy,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: colors.secondaryText,
    lineHeight: 22,
    marginBottom: 24,
  },
  successBox: {
    backgroundColor: "#E6F7F0",
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
  },
  successTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.success,
    marginBottom: 8,
  },
  successText: {
    fontSize: 14,
    color: colors.text,
    textAlign: "center",
    lineHeight: 20,
  },
});
