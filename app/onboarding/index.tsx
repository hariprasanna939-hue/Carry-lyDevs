import React from "react";
import { View, Text, StyleSheet, SafeAreaView } from "react-native";
import { useRouter } from "expo-router";
import { colors } from "../../src/theme/colors";
import Button from "../../src/components/ui/Button";

export default function OnboardingScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.logoBadge}>🚚 CARRY</Text>
        <Text style={styles.title}>Logistics made simple for Coimbatore</Text>
        <Text style={styles.subtitle}>
          Book 3-wheelers, Tata Ace, and pickups for house shifting, hardware cargo, and commercial goods.
        </Text>
      </View>
      <View style={styles.footer}>
        <Button
          title="Get Started"
          size="large"
          onPress={() => router.push("/onboarding/permissions")}
        />
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
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 28,
  },
  logoBadge: {
    fontSize: 28,
    fontWeight: "900",
    color: colors.primary,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: colors.deepNavy,
    lineHeight: 40,
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: colors.secondaryText,
    lineHeight: 24,
  },
  footer: {
    padding: 24,
  },
});
