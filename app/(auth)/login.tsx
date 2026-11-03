import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { colors } from "../../src/theme/colors";
import Button from "../../src/components/ui/Button";
import Input from "../../src/components/ui/Input";
import { authService } from "../../src/features/auth/auth.service";
import { validateLoginInput } from "../../src/features/auth/auth.validation";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    setError(null);
    const validation = validateLoginInput(email, password);
    if (!validation.isValid) {
      setError(validation.error || "Please enter valid credentials.");
      return;
    }

    try {
      setLoading(true);
      const user = await authService.login(email, password);
      if (user?.activePortal === "driver" && user.driverVerificationStatus === "approved") {
        router.replace("/(driver)");
      } else {
        router.replace("/(customer)");
      }
    } catch (err: any) {
      setError(err?.message || "Failed to sign in. Please verify your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <Text style={styles.brand}>CARRY</Text>
          <Text style={styles.title}>Welcome back</Text>
          <Text style={styles.subtitle}>Sign in to book goods vehicles or manage your trips</Text>
        </View>

        {error ? (
          <View style={styles.errorBanner}>
            <Text style={styles.errorBannerText}>{error}</Text>
          </View>
        ) : null}

        <Input
          label="Email address"
          placeholder="name@example.com"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <Input
          label="Password"
          placeholder="Enter password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity
          onPress={() => router.push("/(auth)/forgot-password")}
          style={styles.forgotBtn}
        >
          <Text style={styles.forgotText}>Forgot password?</Text>
        </TouchableOpacity>

        <Button
          title="Sign In"
          size="large"
          loading={loading}
          onPress={handleLogin}
          style={styles.submitBtn}
        />

        <View style={styles.footerRow}>
          <Text style={styles.footerText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => router.push("/(auth)/register")}>
            <Text style={styles.registerLink}>Register</Text>
          </TouchableOpacity>
        </View>

        <Button
          title="Continue as Guest (Customer)"
          variant="outline"
          size="medium"
          style={{ marginTop: 20 }}
          onPress={() => router.replace("/(customer)")}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  scroll: {
    padding: 24,
    justifyContent: "center",
    flexGrow: 1,
  },
  header: {
    marginBottom: 28,
  },
  brand: {
    fontSize: 26,
    fontWeight: "900",
    color: colors.primary,
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: colors.deepNavy,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    color: colors.secondaryText,
    lineHeight: 22,
  },
  errorBanner: {
    backgroundColor: "#FDECEE",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorBannerText: {
    color: colors.danger,
    fontSize: 13,
    fontWeight: "600",
  },
  forgotBtn: {
    alignSelf: "flex-end",
    marginBottom: 20,
  },
  forgotText: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: "600",
  },
  submitBtn: {
    marginTop: 4,
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
  },
  footerText: {
    color: colors.secondaryText,
    fontSize: 14,
  },
  registerLink: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: "700",
  },
});
