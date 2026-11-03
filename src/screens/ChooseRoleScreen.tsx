import React, { useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { ChevronLeft } from "lucide-react-native";
import { CarryLogo } from "../components/CarryLogo";
import {
  RoleSelectionButton,
  RoleSelectionCard,
  RoleType,
} from "../components/role-selection";
import { setSelectedRole } from "../features/onboarding/onboardingStorage";
import { colors } from "../theme/colors";

interface Props {
  onBack: () => void;
  onContinue: (role: RoleType) => void;
}

/**
 * Choose Your Role Screen
 * Appears immediately after Onboarding and before Login/Registration.
 */
export default function ChooseRoleScreen({ onBack, onContinue }: Props) {
  const [selectedRole, setLocalRole] = useState<RoleType | null>(null);

  const handleSelect = (role: RoleType) => {
    setLocalRole(role);
  };

  const handleContinue = async () => {
    if (!selectedRole) return;
    await setSelectedRole(selectedRole);
    onContinue(selectedRole);
  };

  const buttonLabel = !selectedRole
    ? "Select an account type"
    : selectedRole === "customer"
    ? "Continue as Customer"
    : "Continue as Driver";

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />

      {/* Top Header */}
      <View style={styles.header}>
        <Pressable
          onPress={onBack}
          hitSlop={12}
          style={styles.backButton}
          accessibilityLabel="Go back to onboarding"
        >
          <ChevronLeft size={22} color={colors.primaryBlack} />
        </Pressable>

        <CarryLogo size={24} tone="dark" variant="wheel" />

        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Screen Heading */}
        <View style={styles.headingSection}>
          <Text style={styles.heading}>How would you like to use CARRY?</Text>
          <Text style={styles.subtitle}>
            Choose your account type to continue.
          </Text>
        </View>

        {/* Two Selectable Cards */}
        <View style={styles.cardsContainer}>
          <RoleSelectionCard
            role="customer"
            title="I'm a Customer"
            description="Book a vehicle, move your goods and track your delivery across Coimbatore."
            selected={selectedRole === "customer"}
            onSelect={() => handleSelect("customer")}
          />

          <RoleSelectionCard
            role="driver"
            title="I'm a Driver"
            description="Receive delivery requests, manage your trips and earn with CARRY."
            selected={selectedRole === "driver"}
            onSelect={() => handleSelect("driver")}
          />
        </View>

        {/* Informative footnote */}
        <View style={styles.footnoteRow}>
          <Text style={styles.footnoteText}>
            You can also switch portals anytime from your account settings after signing in.
          </Text>
        </View>
      </ScrollView>

      {/* Fixed Bottom Action Bar */}
      <View style={styles.footer}>
        <RoleSelectionButton
          label={buttonLabel}
          disabled={!selectedRole}
          onPress={handleContinue}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderGrey,
    backgroundColor: colors.white,
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.lightGrey,
    alignItems: "center",
    justifyContent: "center",
  },
  headerSpacer: {
    width: 38,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
  },
  headingSection: {
    marginBottom: 20,
  },
  heading: {
    fontSize: 28,
    fontWeight: "900",
    color: colors.primaryBlack,
    letterSpacing: -0.8,
    lineHeight: 34,
  },
  subtitle: {
    fontSize: 15,
    color: colors.secondaryText,
    marginTop: 8,
    lineHeight: 22,
  },
  cardsContainer: {
    gap: 8,
  },
  footnoteRow: {
    marginTop: 20,
    paddingHorizontal: 8,
    alignItems: "center",
  },
  footnoteText: {
    fontSize: 12,
    color: colors.secondaryText,
    textAlign: "center",
    lineHeight: 18,
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 24,
    backgroundColor: colors.cardSurface,
    borderTopWidth: 1,
    borderTopColor: colors.borderGrey,
  },
});
