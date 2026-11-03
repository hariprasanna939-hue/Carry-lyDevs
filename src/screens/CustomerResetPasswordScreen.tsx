import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Check, Minus } from "lucide-react-native";
import { CarryButton, CarryField, CarryTopBar } from "../components/CarryUI";
import { colors } from "../theme/colors";

interface Props {
  onBack: () => void;
  onSuccess: () => void;
}

export default function CustomerResetPasswordScreen({
  onBack,
  onSuccess,
}: Props) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const rules = [
    {
      label: "At least 8 characters",
      ok: password.length >= 8,
    },
    {
      label: "One number",
      ok: /\d/.test(password),
    },
    {
      label: "One capital letter",
      ok: /[A-Z]/.test(password),
    },
  ];

  const allRulesPass = rules.every((r) => r.ok);
  const passwordsMatch = password.length > 0 && password === confirmPassword;
  const isValid = allRulesPass && passwordsMatch;

  const handleUpdate = () => {
    if (!isValid) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      Alert.alert(
        "Password Updated",
        "Your new password has been set. Please log in with your new credentials.",
        [{ text: "OK", onPress: onSuccess }]
      );
    }, 600);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <CarryTopBar onBack={onBack} title="Set a new password" large />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.sub}>
            Choose something you haven’t used on CARRY before.
          </Text>

          <View style={styles.form}>
            <CarryField
              label="New password"
              value={password}
              onChangeText={setPassword}
              password
              placeholder="Enter new password"
            />

            <View style={styles.rulesList}>
              {rules.map((r) => (
                <View key={r.label} style={styles.ruleItem}>
                  <View
                    style={[
                      styles.ruleDot,
                      r.ok ? styles.ruleDotOk : styles.ruleDotPending,
                    ]}
                  >
                    {r.ok ? (
                      <Check size={10} color="#FFFFFF" strokeWidth={3.5} />
                    ) : (
                      <Minus size={10} color={colors.disabledGrey} strokeWidth={3} />
                    )}
                  </View>
                  <Text
                    style={[
                      styles.ruleText,
                      r.ok ? styles.ruleTextOk : styles.ruleTextPending,
                    ]}
                  >
                    {r.label}
                  </Text>
                </View>
              ))}
            </View>

            <CarryField
              label="Confirm new password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              password
              placeholder="Confirm new password"
              error={
                confirmPassword.length > 0 && !passwordsMatch
                  ? "Passwords don’t match"
                  : undefined
              }
            />
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <CarryButton
            onPress={handleUpdate}
            variant="primary"
            disabled={!isValid || loading}
            loading={loading}
          >
            Update password
          </CarryButton>
        </View>
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
    paddingTop: 8,
    paddingBottom: 24,
  },
  sub: {
    fontSize: 15,
    color: colors.secondaryText,
    marginBottom: 24,
    lineHeight: 22,
  },
  form: {
    gap: 16,
  },
  rulesList: {
    gap: 8,
    marginVertical: 4,
  },
  ruleItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  ruleDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  ruleDotOk: {
    backgroundColor: colors.primaryBlack,
  },
  ruleDotPending: {
    borderWidth: 1,
    borderColor: colors.disabledGrey,
  },
  ruleText: {
    fontSize: 13,
  },
  ruleTextOk: {
    color: colors.mainText,
    fontWeight: "600",
  },
  ruleTextPending: {
    color: colors.secondaryText,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.borderGrey,
    backgroundColor: colors.cardSurface,
  },
});
