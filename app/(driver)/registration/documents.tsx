import React, { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { colors } from "../../../src/theme/colors";
import Button from "../../../src/components/ui/Button";
import { driversService } from "../../../src/features/drivers/drivers.service";
import { useAuth } from "../../../src/hooks/useAuth";

export default function DriverDocumentsRegistrationScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [submitting, setSubmitting] = useState(false);

  const [docs, setDocs] = useState({
    dl: false,
    rc: false,
    insurance: false,
    aadhar: false,
  });

  const toggleDoc = (key: keyof typeof docs) => {
    setDocs((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      if (user?.uid) {
        await driversService.applyAsDriver({
          userId: user.uid,
          fullName: user.fullName || "Driver",
          email: user.email || "",
          phone: user.phone || "",
        });
      }
      router.replace("/(driver)/registration/status");
    } catch (err: any) {
      Alert.alert("Submission Error", err?.message || "Failed to submit application.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.stepIndicator}>Step 3 of 3: KYC Verification</Text>
        <Text style={styles.title}>Upload Documents</Text>
        <Text style={styles.subtitle}>
          Government ID and vehicle papers are required for driver onboarding
        </Text>

        <TouchableOpacity
          style={[styles.uploadBox, docs.dl && styles.uploadBoxUploaded]}
          onPress={() => toggleDoc("dl")}
        >
          <Text style={styles.uploadIcon}>{docs.dl ? "✓" : "📄"}</Text>
          <View style={styles.uploadInfo}>
            <Text style={styles.uploadTitle}>Commercial Driving License (DL)</Text>
            <Text style={styles.uploadSub}>{docs.dl ? "Uploaded" : "Tap to attach photo or PDF"}</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.uploadBox, docs.rc && styles.uploadBoxUploaded]}
          onPress={() => toggleDoc("rc")}
        >
          <Text style={styles.uploadIcon}>{docs.rc ? "✓" : "📑"}</Text>
          <View style={styles.uploadInfo}>
            <Text style={styles.uploadTitle}>Vehicle Registration Certificate (RC)</Text>
            <Text style={styles.uploadSub}>{docs.rc ? "Uploaded" : "Tap to attach photo or PDF"}</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.uploadBox, docs.insurance && styles.uploadBoxUploaded]}
          onPress={() => toggleDoc("insurance")}
        >
          <Text style={styles.uploadIcon}>{docs.insurance ? "✓" : "🛡️"}</Text>
          <View style={styles.uploadInfo}>
            <Text style={styles.uploadTitle}>Valid Commercial Insurance</Text>
            <Text style={styles.uploadSub}>{docs.insurance ? "Uploaded" : "Tap to attach photo or PDF"}</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.uploadBox, docs.aadhar && styles.uploadBoxUploaded]}
          onPress={() => toggleDoc("aadhar")}
        >
          <Text style={styles.uploadIcon}>{docs.aadhar ? "✓" : "🆔"}</Text>
          <View style={styles.uploadInfo}>
            <Text style={styles.uploadTitle}>Aadhaar Card (Front & Back)</Text>
            <Text style={styles.uploadSub}>{docs.aadhar ? "Uploaded" : "Tap to attach photo or PDF"}</Text>
          </View>
        </TouchableOpacity>

        <Button
          title="Submit Application for Review"
          size="large"
          loading={submitting}
          onPress={handleSubmit}
          style={{ marginTop: 20 }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  scroll: {
    padding: 24,
    flexGrow: 1,
  },
  stepIndicator: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.primary,
    textTransform: "uppercase",
    marginBottom: 6,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: colors.deepNavy,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: colors.secondaryText,
    marginBottom: 20,
  },
  uploadBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.background,
    padding: 16,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: colors.border,
    marginBottom: 12,
  },
  uploadBoxUploaded: {
    borderColor: colors.success,
    backgroundColor: "#F0FDF4",
  },
  uploadIcon: {
    fontSize: 24,
    marginRight: 14,
  },
  uploadInfo: {
    flex: 1,
  },
  uploadTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.deepNavy,
  },
  uploadSub: {
    fontSize: 12,
    color: colors.secondaryText,
    marginTop: 2,
  },
});
