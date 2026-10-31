import React, { useState } from "react";
import {
  Alert,
  Image,
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
  onRegister: () => void;
}

export default function LoginScreen({ onRegister }: Props) {
  const { login } = useCarryAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      Alert.alert("Missing details", "Enter your email and password.");
      return;
    }
    try {
      setLoading(true);
      await login(email, password);
    } catch (error: any) {
      Alert.alert(
        "Login failed",
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
        <View style={styles.logoWrapper}>
          <Image
            source={require("../../assets/logo.png")}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>
        <Text style={styles.tagline}>Move anything. Anywhere.</Text>

        <View style={styles.card}>
          <Text style={styles.heading}>Welcome back</Text>
          <Text style={styles.description}>
            Sign in to continue your journey.
          </Text>

          <Text style={styles.label}>Email address</Text>
          <TextInput
            style={styles.input}
            placeholder="name@example.com"
            placeholderTextColor="#9A9EAB"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            autoComplete="email"
          />

          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your password"
            placeholderTextColor="#9A9EAB"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoComplete="password"
          />

          <CarryButton
            title="Sign in"
            onPress={handleLogin}
            loading={loading}
          />

          <Text style={styles.footer}>
            New to CARRY?{" "}
            <Text style={styles.link} onPress={onRegister}>
              Create an account
            </Text>
          </Text>
        </View>

        <Text style={styles.location}>
          Starting in Coimbatore, Tamil Nadu
        </Text>
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
  logoWrapper: {
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginBottom: 6,
  },
  logoImage: {
    width: 200,
    height: 90,
  },
  tagline: {
    fontSize: 14,
    color: colors.secondaryText,
    textAlign: "center",
    marginTop: 5,
    marginBottom: 34,
  },
  card: {
    backgroundColor: colors.surface,
    padding: 22,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.border,
  },
  heading: {
    fontSize: 25,
    fontWeight: "800",
    color: colors.text,
  },
  description: {
    fontSize: 14,
    color: colors.secondaryText,
    marginTop: 7,
    marginBottom: 25,
  },
  label: {
    color: colors.text,
    fontWeight: "600",
    fontSize: 13,
    marginBottom: 8,
  },
  input: {
    height: 52,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 14,
    color: colors.text,
    fontSize: 15,
    marginBottom: 19,
    backgroundColor: "#FFFFFF",
  },
  footer: {
    textAlign: "center",
    marginTop: 22,
    color: colors.secondaryText,
    fontSize: 13,
  },
  link: {
    color: colors.primary,
    fontWeight: "700",
  },
  location: {
    textAlign: "center",
    marginTop: 25,
    color: colors.secondaryText,
    fontSize: 12,
  },
});
