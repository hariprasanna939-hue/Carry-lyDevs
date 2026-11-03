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
  destination?: string;
  onBack: () => void;
  onSuccess: () => void;
}

export default function CustomerVerifyOTPScreen({
  destination = "+91 98430 21765",
  onBack,
  onSuccess,
}: Props) {
  const [code, setCode] = useState("");
  const [seconds, setSeconds] = useState(30);
  const [isVerifying, setIsVerifying] = useState(false);
  const [hasError, setHasError] = useState(false);
  const inputRef = useRef<any>(null);

  useEffect(() => {
    if (seconds <= 0) return;
    const timer = setInterval(() => setSeconds((s) => s - 1), 1000);
    return () => clearInterval(timer);
  }, [seconds]);

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
      <CarryTopBar onBack={onBack} title="Verify your mobile" large />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.sub}>
            Enter the 6-digit code sent to{" "}
            <Text style={styles.highlight}>{destination}</Text>.
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
              That code isn’t right. Check the latest SMS and try again.
            </Text>
          )}

          {/* Resend Section */}
          <View style={styles.resendRow}>
            {seconds > 0 ? (
              <Text style={styles.resendText}>
                Resend code in{" "}
                <Text style={styles.timerText}>
                  0:{String(seconds).padStart(2, "0")}
                </Text>
              </Text>
            ) : (
              <Pressable onPress={() => setSeconds(30)}>
                <Text style={styles.resendAction}>Resend code</Text>
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
            Verify code
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
    lineHeight: 22,
    marginBottom: 28,
  },
  highlight: {
    fontWeight: "700",
    color: colors.primaryBlack,
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
    fontSize: 24,
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
  resendRow: {
    marginTop: 24,
  },
  resendText: {
    fontSize: 14,
    color: colors.secondaryText,
  },
  timerText: {
    fontWeight: "700",
    color: colors.primaryBlack,
    fontVariant: ["tabular-nums"],
  },
  resendAction: {
    fontSize: 14,
    fontWeight: "700",
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
