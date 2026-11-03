import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { colors } from "../../../src/theme/colors";
import Button from "../../../src/components/ui/Button";
import DocumentUploader from "../../../src/components/driver/DocumentUploader";
import { useAuth } from "../../../src/hooks/useAuth";
import { auth } from "../../../src/firebase/firebase";
import { driverOnboardingService } from "../../../src/services/driver-onboarding.service";
import {
  ApprovalLevelStatus,
  DriverApplicationRecord,
  DriverCorrectionItem,
} from "../../../src/types/driver-onboarding";

export default function DriverStatusHubScreen() {
  const router = useRouter();
  const { user, firebaseUser, refreshProfile } = useAuth();
  const uid = auth.currentUser?.uid || firebaseUser?.uid || user?.uid || "";

  const [loading, setLoading] = useState(true);
  const [appRecord, setAppRecord] = useState<DriverApplicationRecord | null>(null);

  // Correction Resubmission State
  const [activeCorrection, setActiveCorrection] = useState<DriverCorrectionItem | null>(null);
  const [replacementImageUri, setReplacementImageUri] = useState<string>("");
  const [resubmitting, setResubmitting] = useState(false);

  // Admin Testing Simulation Modal
  const [showAdminModal, setShowAdminModal] = useState(false);

  const fetchStatus = async () => {
    try {
      setLoading(true);
      const app = await driverOnboardingService.getDriverApplication(uid);
      setAppRecord(app);
    } catch (e) {
      console.log("Status fetch error:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, [uid]);

  const handleResubmit = async () => {
    if (!activeCorrection || !replacementImageUri) {
      Alert.alert("Image Required", "Please capture or choose a new document image.");
      return;
    }

    try {
      setResubmitting(true);
      const updated = await driverOnboardingService.resubmitCorrection(
        uid,
        activeCorrection.id,
        replacementImageUri
      );
      setAppRecord(updated);
      setActiveCorrection(null);
      setReplacementImageUri("");
      Alert.alert("Resubmitted", "Your updated document has been sent to the Coimbatore verification team.");
    } catch (e: any) {
      Alert.alert("Resubmission Error", e?.message || "Failed to update document.");
    } finally {
      setResubmitting(false);
    }
  };

  // Admin simulation actions for testing
  const handleAdminAction = async (
    decision: "APPROVED" | "REJECTED" | "NEEDS_CORRECTION",
    reason: string
  ) => {
    try {
      const updated = await driverOnboardingService.adminReviewDriver(
        "admin_coimbatore_office",
        uid,
        decision,
        reason,
        decision === "NEEDS_CORRECTION"
          ? {
              section: "licence",
              documentType: "Driving Licence (Commercial)",
              reason: "Blurry photo. The expiry date and transport badge are unreadable.",
            }
          : undefined
      );
      setAppRecord(updated);
      await refreshProfile();
      setShowAdminModal(false);
      Alert.alert("Admin Action Applied", `Application status changed to ${decision}.`);
    } catch (e: any) {
      Alert.alert("Admin Error", e?.message || "Failed to apply admin action.");
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.centerText}>Loading Onboarding Status...</Text>
      </View>
    );
  }

  const status = appRecord?.status || "DRAFT";
  const isApproved = status === "APPROVED";
  const needsCorrection = status === "NEEDS_CORRECTION" || (appRecord?.correctionItems && appRecord.correctionItems.some((c) => !c.resolved));

  const getStatusColor = () => {
    switch (status) {
      case "APPROVED":
        return "#15803D";
      case "UNDER_REVIEW":
      case "SUBMITTED":
        return "#D97706";
      case "NEEDS_CORRECTION":
        return "#DC2626";
      case "REJECTED":
      case "SUSPENDED":
        return "#991B1B";
      default:
        return "#475569";
    }
  };

  const renderApprovalLevelBadge = (levelStatus: ApprovalLevelStatus) => {
    switch (levelStatus) {
      case "verified":
        return <Text style={[styles.levelBadge, styles.levelVerified]}>APPROVED</Text>;
      case "rejected":
        return <Text style={[styles.levelBadge, styles.levelRejected]}>REJECTED</Text>;
      case "needs_correction":
        return <Text style={[styles.levelBadge, styles.levelCorrection]}>ACTION NEEDED</Text>;
      default:
        return <Text style={[styles.levelBadge, styles.levelPending]}>PENDING REVIEW</Text>;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Top Status Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Application Status Hub</Text>
          <TouchableOpacity onPress={fetchStatus} style={styles.refreshBtn}>
            <Text style={styles.refreshText}>🔄 Refresh</Text>
          </TouchableOpacity>
        </View>

        {/* Status Hero Card */}
        <View style={styles.statusHero}>
          <View style={[styles.statusPill, { backgroundColor: getStatusColor() }]}>
            <Text style={styles.statusPillText}>{status.replace("_", " ")}</Text>
          </View>

          <Text style={styles.refNumber}>Ref: {appRecord?.referenceNumber || "CARRY-DRV-2026-PENDING"}</Text>

          <Text style={styles.statusDesc}>
            {isApproved
              ? "Congratulations! Your driver account and documents are fully approved. You can now go online to accept cargo and moving requests."
              : needsCorrection
              ? "One or more documents require your immediate attention. Please replace the flagged documents below to proceed."
              : status === "SUBMITTED" || status === "UNDER_REVIEW"
              ? "Your application is currently being verified by CARRY's Coimbatore operations desk. Verifications are typically completed within 24 business hours."
              : "Your application is incomplete. Please finish all 12 registration steps."}
          </Text>

          {appRecord?.adminRemarks ? (
            <View style={styles.adminRemarkBox}>
              <Text style={styles.adminRemarkTitle}>Admin Remarks:</Text>
              <Text style={styles.adminRemarkText}>{appRecord.adminRemarks}</Text>
            </View>
          ) : null}
        </View>

        {/* ========================================================
            3-LEVEL DECOUPLED APPROVAL BREAKDOWN
           ======================================================== */}
        <Text style={styles.sectionTitle}>3-Level Onboarding Verification</Text>
        <Text style={styles.sectionSubtitle}>
          CARRY separates driver eligibility, vehicle approvals, and bank accounts to guarantee independent safety checks.
        </Text>

        {/* Level 1: Driver Approval */}
        <View style={styles.levelCard}>
          <View style={styles.levelHeader}>
            <View style={{ flex: 1 }}>
              <Text style={styles.levelTitle}>1. Driver Partner Verification</Text>
              <Text style={styles.levelDesc}>Background check, Aadhaar KYC & Commercial Driving Licence</Text>
            </View>
            {renderApprovalLevelBadge(appRecord?.driverApproval || "pending")}
          </View>
        </View>

        {/* Level 2: Vehicle Approval */}
        <View style={styles.levelCard}>
          <View style={styles.levelHeader}>
            <View style={{ flex: 1 }}>
              <Text style={styles.levelTitle}>2. Vehicle Approval ({appRecord?.vehicles.length || 1} registered)</Text>
              <Text style={styles.levelDesc}>RC Book, Commercial Insurance & Payload Capacity</Text>
            </View>
            {renderApprovalLevelBadge(appRecord?.vehicleApproval || "pending")}
          </View>

          {/* Registered Vehicle List */}
          {appRecord?.vehicles && appRecord.vehicles.length > 0 ? (
            <View style={styles.vehicleList}>
              {appRecord.vehicles.map((veh) => (
                <View key={veh.id} style={styles.vehicleItem}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.vehicleReg}>{veh.registrationNumber}</Text>
                    <Text style={styles.vehicleMeta}>{veh.categoryDisplayName} · {veh.make} {veh.model}</Text>
                    <Text style={styles.vehicleMeta}>Insurance Expiry: {veh.documents.insuranceExpiry}</Text>
                  </View>
                  {renderApprovalLevelBadge(veh.approvalStatus)}
                </View>
              ))}
            </View>
          ) : null}
        </View>

        {/* Level 3: Bank Account Verification */}
        <View style={styles.levelCard}>
          <View style={styles.levelHeader}>
            <View style={{ flex: 1 }}>
              <Text style={styles.levelTitle}>3. Bank Account & Payouts</Text>
              <Text style={styles.levelDesc}>Direct settlement verification for trip earnings</Text>
            </View>
            {renderApprovalLevelBadge(appRecord?.bankVerification || "pending")}
          </View>
          {appRecord?.bankDetails && (
            <Text style={styles.bankMeta}>
              {appRecord.bankDetails.bankName} · {appRecord.bankDetails.accountNumberMasked}
            </Text>
          )}
        </View>

        {/* ========================================================
            DOCUMENT CORRECTION RESUBMISSION SECTION
           ======================================================== */}
        {needsCorrection && appRecord?.correctionItems && (
          <View style={styles.correctionSection}>
            <Text style={styles.correctionHeading}>⚠️ Action Required: Corrections Requested</Text>
            {appRecord.correctionItems
              .filter((c) => !c.resolved)
              .map((corr) => (
                <View key={corr.id} style={styles.correctionCard}>
                  <Text style={styles.corrDocName}>{corr.documentType}</Text>
                  <Text style={styles.corrReason}>Reason: {corr.rejectionReason}</Text>
                  <Text style={styles.corrAction}>{corr.requiredAction}</Text>
                  <Button
                    title="Replace & Resubmit Document"
                    size="small"
                    variant="outline"
                    onPress={() => setActiveCorrection(corr)}
                    style={{ marginTop: 8 }}
                  />
                </View>
              ))}
          </View>
        )}

        {/* Action Button */}
        {isApproved ? (
          <Button
            title="Launch Driver Dashboard"
            size="large"
            onPress={() => router.replace("/(driver)")}
            style={{ marginTop: 20 }}
          />
        ) : (
          <Button
            title="Continue / Edit Registration"
            variant="outline"
            size="medium"
            onPress={() => router.push("/(driver)/registration/onboarding")}
            style={{ marginTop: 16 }}
          />
        )}

        {/* Admin Testing Tools (Development / Demo helper) */}
        <View style={styles.adminToolBox}>
          <Text style={styles.adminToolTitle}>🛠️ Verification Testing Tool</Text>
          <Text style={styles.adminToolDesc}>
            Test different verification states (Approved, Needs Correction, Rejected) as an authorized admin.
          </Text>
          <Button
            title="Open Admin Review Modal"
            variant="outline"
            size="small"
            onPress={() => setShowAdminModal(true)}
          />
        </View>
      </ScrollView>

      {/* ========================================================
          DOCUMENT RESUBMISSION MODAL
         ======================================================== */}
      <Modal visible={!!activeCorrection} transparent animationType="slide">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalHeaderTitle}>Resubmit Document</Text>
            <Text style={styles.modalDocTitle}>{activeCorrection?.documentType}</Text>
            <Text style={styles.modalReasonText}>Remark: {activeCorrection?.rejectionReason}</Text>

            <DocumentUploader
              title="Upload Corrected Document"
              subtitle="Ensure photo is well-lit, in-focus, and corners are visible."
              imageUri={replacementImageUri}
              onImageSelected={setReplacementImageUri}
              required
            />

            <View style={{ flexDirection: "row", gap: 10, marginTop: 16 }}>
              <Button
                title="Cancel"
                variant="outline"
                size="medium"
                onPress={() => {
                  setActiveCorrection(null);
                  setReplacementImageUri("");
                }}
                style={{ flex: 1 }}
              />
              <Button
                title="Resubmit"
                size="medium"
                loading={resubmitting}
                onPress={handleResubmit}
                style={{ flex: 1 }}
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* ========================================================
          ADMIN TESTING MODAL
         ======================================================== */}
      <Modal visible={showAdminModal} transparent animationType="slide">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalHeaderTitle}>Admin Approval Simulation</Text>
            <Text style={styles.modalDocTitle}>Driver: {appRecord?.personalDetails?.fullName || "Partner"}</Text>

            <Button
              title="✅ Approve Driver (Full Access)"
              size="medium"
              onPress={() => handleAdminAction("APPROVED", "Verified all Coimbatore KYC documents, licence, and vehicle inspection.")}
              style={{ marginVertical: 6, backgroundColor: "#15803D" }}
            />

            <Button
              title="⚠️ Request Correction (Licence Blurry)"
              size="medium"
              variant="outline"
              onPress={() => handleAdminAction("NEEDS_CORRECTION", "Commercial driving licence image is blurry. Please upload a clear photo.")}
              style={{ marginVertical: 6 }}
            />

            <Button
              title="❌ Reject Application (KYC Mismatch)"
              size="medium"
              onPress={() => handleAdminAction("REJECTED", "Identity document does not match the legal name entered.")}
              style={{ marginVertical: 6, backgroundColor: "#B91C1C" }}
            />

            <Button
              title="Close"
              variant="outline"
              size="small"
              onPress={() => setShowAdminModal(false)}
              style={{ marginTop: 10 }}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    padding: 20,
    paddingBottom: 40,
  },
  centerContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  centerText: {
    marginTop: 12,
    fontSize: 15,
    color: colors.secondaryText,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: colors.deepNavy,
  },
  refreshBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: "#F1F5F9",
  },
  refreshText: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.primary,
  },
  statusHero: {
    backgroundColor: colors.surface,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    marginBottom: 20,
  },
  statusPill: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 10,
  },
  statusPillText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 1,
  },
  refNumber: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.secondaryText,
    marginBottom: 8,
  },
  statusDesc: {
    fontSize: 14,
    color: colors.deepNavy,
    textAlign: "center",
    lineHeight: 20,
  },
  adminRemarkBox: {
    marginTop: 12,
    backgroundColor: "#FEF2F2",
    padding: 10,
    borderRadius: 8,
    width: "100%",
  },
  adminRemarkTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: "#991B1B",
  },
  adminRemarkText: {
    fontSize: 12,
    color: "#7F1D1D",
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: colors.deepNavy,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: colors.secondaryText,
    marginBottom: 12,
    lineHeight: 18,
  },
  levelCard: {
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 12,
  },
  levelHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 10,
  },
  levelTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.deepNavy,
    marginBottom: 2,
  },
  levelDesc: {
    fontSize: 12,
    color: colors.secondaryText,
    lineHeight: 16,
  },
  levelBadge: {
    fontSize: 10,
    fontWeight: "800",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    overflow: "hidden",
  },
  levelVerified: {
    backgroundColor: "#DCFCE7",
    color: "#166534",
  },
  levelPending: {
    backgroundColor: "#FEF3C7",
    color: "#92400E",
  },
  levelCorrection: {
    backgroundColor: "#FEE2E2",
    color: "#991B1B",
  },
  levelRejected: {
    backgroundColor: "#F1F5F9",
    color: "#64748B",
  },
  vehicleList: {
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 10,
    gap: 8,
  },
  vehicleItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F8FAFC",
    padding: 10,
    borderRadius: 8,
  },
  vehicleReg: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.deepNavy,
  },
  vehicleMeta: {
    fontSize: 11,
    color: colors.secondaryText,
  },
  bankMeta: {
    marginTop: 8,
    fontSize: 13,
    fontWeight: "600",
    color: "#334155",
  },
  correctionSection: {
    marginTop: 10,
    marginBottom: 16,
  },
  correctionHeading: {
    fontSize: 15,
    fontWeight: "800",
    color: "#DC2626",
    marginBottom: 8,
  },
  correctionCard: {
    backgroundColor: "#FFF5F5",
    borderWidth: 1,
    borderColor: "#FECACA",
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
  },
  corrDocName: {
    fontSize: 14,
    fontWeight: "700",
    color: "#991B1B",
    marginBottom: 2,
  },
  corrReason: {
    fontSize: 12,
    fontWeight: "600",
    color: "#B91C1C",
  },
  corrAction: {
    fontSize: 12,
    color: "#7F1D1D",
    marginTop: 2,
    lineHeight: 16,
  },
  adminToolBox: {
    marginTop: 28,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    padding: 14,
    alignItems: "center",
  },
  adminToolTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.deepNavy,
  },
  adminToolDesc: {
    fontSize: 11,
    color: colors.secondaryText,
    textAlign: "center",
    marginVertical: 4,
    lineHeight: 15,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "flex-end",
  },
  modalCard: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: "85%",
  },
  modalHeaderTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.deepNavy,
    marginBottom: 4,
  },
  modalDocTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.primary,
    marginBottom: 4,
  },
  modalReasonText: {
    fontSize: 12,
    color: "#991B1B",
    marginBottom: 12,
  },
});
