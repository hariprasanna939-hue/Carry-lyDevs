import React, { useEffect, useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CarryButton, CarryTopBar } from "../components/CarryUI";
import { colors } from "../theme/colors";

interface Props {
  mobile?: string;
  onBack: () => void;
  onSuccess: () => void;
}

export default function DriverVerifyOTPScreen({
  mobile = "+91 98431 27560",
  onBack,
  onSuccess,
}: Props) {
  const [code, setCode] = useState("4821");
  const [resendIn, setResendIn] = useState(24);
  const [isVerifying, setIsVerifying] = useState(false);
  const [hasError, setHasError] = useState(false);
  const inputRef = useRef<any>(null);

  useEffect(() => {
    if (resendIn <= 0) return;
    const timer = setInterval(() => setResendIn((s) => s - 1), 1000);
    return () => clearInterval(timer);
  }, [resendIn]);

  const handleVerify = () => {
    if (code.length < 6) return;
    setIsVerifying(true);
    setHasError(false);

    setTimeout(() => {
      setIsVerifying(false);
      onSuccess();
    }, 700);
  };

  const digits = code.padEnd(6, " ").slice(0, 6).split("");

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
          <Text style={styles.title}>Enter the code</Text>
          <Text style={styles.sub}>
            Sent by SMS to <Text style={styles.highlight}>{mobile}</Text>.{" "}
            <Text onPress={onBack} style={styles.changeAction}>
              Change
            </Text>
          </Text>

          {/* Hidden Real Input */}
          <TextInput
            ref={inputRef}
            value={code}
            onChangeText={(text) => {
              const cleaned = text.replace(/[^0-9]/g, "").slice(0, 6);
              setCode(cleaned);
              if (hasError) setHasError(false);
            }}
            keyboardType="number-pad"
            maxLength={6}
            style={styles.hiddenInput}
            autoFocus
          />

          {/* 6 Visual OTP Boxes */}
          <Pressable
            onPress={() => inputRef.current?.focus()}
            style={styles.otpGrid}
          >
            {digits.map((digit, i) => {
              const filled = digit.trim() !== "";
              const active = i === code.length;

              return (
                <View
                  key={i}
                  style={[
                    styles.otpBox,
                    filled && styles.otpBoxFilled,
                    active && styles.otpBoxActive,
                    hasError && styles.otpBoxError,
                  ]}
                >
                  <Text style={styles.otpDigit}>{filled ? digit : ""}</Text>
                  {active && <View style={styles.cursor} />}
                </View>
              );
            })}
          </Pressable>

          {hasError && (
            <Text style={styles.errorText}>
              That code isn’t right. Check the SMS and try again.
            </Text>
          )}

          {/* Didn't get it card */}
          <View style={styles.didntGetCard}>
            <Text style={styles.didntGetLabel}>Didn’t get it?</Text>
            {resendIn > 0 ? (
              <Text style={styles.resendCountdown}>
                Resend in 0:{String(resendIn).padStart(2, "0")}
              </Text>
            ) : (
              <Pressable onPress={() => setResendIn(30)}>
                <Text style={styles.resendBtn}>Resend code</Text>
              </Pressable>
            )}
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <CarryButton
            onPress={handleVerify}
            variant="primary"
            disabled={code.length < 6 || isVerifying}
            loading={isVerifying}
          >
            Verify number
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
  highlight: {
    fontWeight: "700",
    color: colors.primaryBlack,
  },
  changeAction: {
    fontWeight: "700",
    color: colors.primaryBlack,
    textDecorationLine: "underline",
  },
  hiddenInput: {
    position: "absolute",
    width: 1,
    height: 1,
    opacity: 0,
  },
  otpGrid: {
    flexDirection: "row",
    gap: 8,
    justifyContent: "space-between",
  },
  otpBox: {
    flex: 1,
    aspectRatio: 4 / 5,
    borderRadius: 14,
    backgroundColor: colors.cardSurface,
    borderWidth: 1,
    borderColor: colors.borderGrey,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  otpBoxFilled: {
    borderColor: colors.primaryBlack,
  },
  otpBoxActive: {
    borderColor: colors.primaryBlack,
    borderWidth: 2,
  },
  otpBoxError: {
    borderColor: colors.error,
    borderWidth: 2,
  },
  otpDigit: {
    fontSize: 26,
    fontWeight: "800",
    color: colors.primaryBlack,
    fontVariant: ["tabular-nums"],
  },
  cursor: {
    position: "absolute",
    width: 2,
    height: 24,
    backgroundColor: colors.primaryBlack,
  },
  errorText: {
    fontSize: 13,
    color: colors.error,
    fontWeight: "600",
    marginTop: 12,
  },
  didntGetCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.lightGrey,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginTop: 24,
  },
  didntGetLabel: {
    fontSize: 14,
    color: colors.secondaryText,
  },
  resendCountdown: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.secondaryText,
    fontVariant: ["tabular-nums"],
  },
  resendBtn: {
    fontSize: 14,
    fontWeight: "800",
    color: colors.primaryBlack,
    textDecorationLine: "underline",
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
