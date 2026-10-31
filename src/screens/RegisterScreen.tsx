import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useCarryAuth } from "../auth/AuthContext";
import CarryButton from "../components/CarryButton";
import { colors } from "../theme/colors";

interface Props {
  onLogin: () => void;
}

export default function RegisterScreen({ onLogin }: Props) {
  const { register } = useCarryAuth();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (
      !fullName.trim() ||
      !phone.trim() ||
      !email.trim() ||
      !password
    ) {
      Alert.alert("Missing details", "Complete all fields.");
      return;
    }

    if (password.length < 6) {
      Alert.alert(
        "Weak password",
        "Use at least 6 characters."
      );
      return;
    }

    try {
      setLoading(true);
      await register(fullName, email, password, phone);
    } catch (error: any) {
      Alert.alert(
        "Registration failed",
        error?.message || "Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.logo}>carry</Text>
        <Text style={styles.subtitle}>
          Create your CARRY account
        </Text>

        <View style={styles.card}>
          <Text style={styles.heading}>Let's get started</Text>

          <Text style={styles.label}>Full name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your name"
            placeholderTextColor="#9A9EAB"
            value={fullName}
            onChangeText={setFullName}
            autoCapitalize="words"
          />

          <Text style={styles.label}>Mobile number</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter mobile number"
            placeholderTextColor="#9A9EAB"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />

          <Text style={styles.label}>Email address</Text>
          <TextInput
            style={styles.input}
            placeholder="name@example.com"
            placeholderTextColor="#9A9EAB"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Create a password"
            placeholderTextColor="#9A9EAB"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <CarryButton
            title="Create account"
            onPress={handleRegister}
            loading={loading}
          />

          <Text style={styles.footer}>
            Already have an account?{" "}
            <Text style={styles.link} onPress={onLogin}>
              Sign in
            </Text>
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 24,
  },
  logo: {
    fontSize: 39,
    fontWeight: "800",
    color: colors.text,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: colors.secondaryText,
    textAlign: "center",
    marginTop: 8,
    marginBottom: 25,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 22,
  },
  heading: {
    fontSize: 23,
    fontWeight: "800",
    color: colors.text,
    marginBottom: 22,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 8,
  },
  input: {
    height: 51,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 13,
    paddingHorizontal: 14,
    marginBottom: 17,
    color: colors.text,
    backgroundColor: "#FFFFFF",
  },
  footer: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 13,
    color: colors.secondaryText,
  },
  link: {
    color: colors.primary,
    fontWeight: "700",
  },
});
