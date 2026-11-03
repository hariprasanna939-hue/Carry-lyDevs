import React from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import {
  AlertCircle,
  Clock,
  FileCheck2,
  Phone,
  ShieldCheck,
  User,
} from "lucide-react-native";
import { useCarryAuth } from "../auth/AuthContext";
import { CarryLogo } from "../components/CarryLogo";
import { CarryButton, CarryCard, CarryStatusTag } from "../components/CarryUI";
import { colors } from "../theme/colors";

interface Props {
  onSwitchToCustomer: () => void;
  onLogout: () => void;
}

/**
 * Driver Pending Verification Screen
 * Displays verification status when a driver has submitted their application
 * but has not yet been approved. Prevents access to driver jobs & earnings.
 */
export default function DriverPendingScreen({
  onSwitchToCustomer,
  onLogout,
}: Props) {
  const { profile } = useCarryAuth();

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />

      {/* Top Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <CarryLogo size={24} tone="dark" variant="crate" />
          <View style={styles.driverBadge}>
            <Text style={styles.driverBadgeText}>Driver Account</Text>
          </View>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Status Callout Card */}
        <CarryCard style={styles.statusCard}>
          <View style={styles.iconCircle}>
            <Clock size={32} color={colors.primaryBlack} />
          </View>

          <View style={styles.tagWrapper}>
            <CarryStatusTag tone="solid">Under Review</CarryStatusTag>
          </View>

          <Text style={styles.title}>Verification in Progress</Text>
          <Text style={styles.subtitle}>
            Hello {profile?.fullName || "Partner"}, your driver onboarding
            documents for Coimbatore are being verified by our compliance team.
          </Text>
        </CarryCard>

        {/* Verification Checklist */}
        <Text style={styles.sectionTitle}>Document Verification Status</Text>
        <CarryCard style={styles.checklistCard}>
          {[
            {
              title: "Commercial Driving Licence",
              status: "In Review",
              desc: "Checking LMV commercial transport endorsement",
            },
            {
              title: "Vehicle Registration Certificate (RC)",
              status: "In Review",
              desc: "Validating city goods carriage permit",
            },
            {
              title: "Commercial Vehicle Insurance",
              status: "In Review",
              desc: "Verifying active third-party & cargo coverage",
            },
          ].map((item, index) => (
            <View key={item.title}>
              <View style={styles.checkRow}>
                <View style={styles.checkIconBox}>
                  <FileCheck2 size={18} color={colors.primaryBlack} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.checkTitle}>{item.title}</Text>
                  <Text style={styles.checkDesc}>{item.desc}</Text>
                </View>
                <CarryStatusTag tone="outline">{item.status}</CarryStatusTag>
              </View>
              {index < 2 && <View style={styles.divider} />}
            </View>
          ))}
        </CarryCard>

        {/* Timeline Note */}
        <CarryCard style={styles.noticeCard}>
          <View style={styles.noticeRow}>
            <AlertCircle size={20} color={colors.primaryBlack} />
            <View style={{ flex: 1 }}>
              <Text style={styles.noticeTitle}>Approval within 24 hours</Text>
              <Text style={styles.noticeSub}>
                You will receive an SMS notification once your mini truck is
                approved to receive live trips.
              </Text>
            </View>
          </View>
        </CarryCard>

        {/* Support Call Button */}
        <Pressable
          onPress={() =>
            Alert.alert(
              "Driver Support",
              "Call Coimbatore Driver Operations at +91 98430 21765?"
            )
          }
          style={styles.supportButton}
        >
          <Phone size={16} color={colors.primaryBlack} />
          <Text style={styles.supportText}>
            Need help? Contact Coimbatore Driver Support
          </Text>
        </Pressable>

        {/* Actions */}
        <View style={styles.actionSection}>
          <CarryButton onPress={onSwitchToCustomer} variant="primary">
            Switch to Customer Portal
          </CarryButton>

          <CarryButton onPress={onLogout} variant="ghost">
            Log Out of Driver Account
          </CarryButton>
        </View>
      </ScrollView>
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
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderGrey,
    backgroundColor: colors.white,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  driverBadge: {
    marginLeft: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 99,
    backgroundColor: colors.lightGrey,
  },
  driverBadgeText: {
    fontSize: 11,
    fontWeight: "800",
    color: colors.primaryBlack,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 32,
  },
  statusCard: {
    alignItems: "center",
    padding: 24,
    marginBottom: 20,
    backgroundColor: colors.white,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.lightGrey,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  tagWrapper: {
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: "900",
    color: colors.primaryBlack,
    letterSpacing: -0.5,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: colors.secondaryText,
    textAlign: "center",
    marginTop: 8,
    lineHeight: 21,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: colors.primaryBlack,
    marginBottom: 10,
    letterSpacing: -0.2,
  },
  checklistCard: {
    padding: 16,
    marginBottom: 16,
  },
  checkRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 8,
  },
  checkIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.lightGrey,
    alignItems: "center",
    justifyContent: "center",
  },
  checkTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.primaryBlack,
  },
  checkDesc: {
    fontSize: 12,
    color: colors.secondaryText,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderGrey,
    marginVertical: 4,
  },
  noticeCard: {
    padding: 16,
    marginBottom: 16,
  },
  noticeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  noticeTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: colors.primaryBlack,
  },
  noticeSub: {
    fontSize: 12,
    color: colors.secondaryText,
    marginTop: 2,
    lineHeight: 18,
  },
  supportButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 12,
    marginBottom: 16,
  },
  supportText: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.primaryBlack,
    textDecorationLine: "underline",
  },
  actionSection: {
    gap: 10,
    marginTop: 8,
  },
});
