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
import { validateRegisterInput } from "../../src/features/auth/auth.validation";
import { UserRole } from "../../src/types/user";

export default function RegisterScreen() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState<UserRole>("customer");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async () => {
    setError(null);
    const payload = {
      fullName,
      email,
      phone,
      password,
      role: selectedRole,
    };

    const validation = validateRegisterInput(payload);
    if (!validation.isValid) {
      setError(validation.error || "Please check your inputs.");
      return;
    }

    try {
      setLoading(true);
      const user = await authService.register(payload);
      if (user.activePortal === "driver") {
        router.replace("/(driver)/registration/personal");
      } else {
        router.replace("/(customer)");
      }
    } catch (err: any) {
      setError(err?.message || "Registration failed. Please try again.");
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
          <Text style={styles.title}>Create account</Text>
          <Text style={styles.subtitle}>Sign up to transport cargo across Coimbatore</Text>
        </View>

        {error ? (
          <View style={styles.errorBanner}>
            <Text style={styles.errorBannerText}>{error}</Text>
          </View>
        ) : null}

        <View style={styles.roleSelector}>
          <TouchableOpacity
            style={[
              styles.roleBtn,
              selectedRole === "customer" && styles.roleBtnActive,
            ]}
            onPress={() => setSelectedRole("customer")}
          >
            <Text
              style={[
                styles.roleText,
                selectedRole === "customer" && styles.roleTextActive,
              ]}
            >
              Customer / Shipper
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.roleBtn,
              selectedRole === "driver" && styles.roleBtnActive,
            ]}
            onPress={() => setSelectedRole("driver")}
          >
            <Text
              style={[
                styles.roleText,
                selectedRole === "driver" && styles.roleTextActive,
              ]}
            >
              Truck Driver / Partner
            </Text>
          </TouchableOpacity>
        </View>

        <Input
          label="Full Name"
          placeholder="e.g. Anand Kumar"
          value={fullName}
          onChangeText={setFullName}
        />

        <Input
          label="Mobile Phone"
          placeholder="10-digit number (e.g. 9876543210)"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />

        <Input
          label="Email Address"
          placeholder="name@example.com"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <Input
          label="Password"
          placeholder="Min 6 characters"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <Button
          title={selectedRole === "driver" ? "Register & Onboard Driver" : "Register as Customer"}
          size="large"
          loading={loading}
          onPress={handleRegister}
          style={styles.submitBtn}
        />

        <View style={styles.footerRow}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => router.push("/(auth)/login")}>
            <Text style={styles.loginLink}>Sign In</Text>
          </TouchableOpacity>
        </View>
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
    marginBottom: 24,
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
  roleSelector: {
    flexDirection: "row",
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
  },
  roleBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 8,
  },
  roleBtnActive: {
    backgroundColor: colors.surface,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  roleText: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.secondaryText,
  },
  roleTextActive: {
    color: colors.primary,
    fontWeight: "700",
  },
  submitBtn: {
    marginTop: 10,
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
  loginLink: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: "700",
  },
});
