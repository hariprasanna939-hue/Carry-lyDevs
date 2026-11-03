import React, { useState } from "react";
import {
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Mail,
  MessageCircle,
  Phone,
  ShieldAlert,
} from "lucide-react-native";
import { CarryButton, CarryCard } from "../../components/CarryUI";
import { colors } from "../../theme/colors";

interface Props {
  visible: boolean;
  onClose: () => void;
}

const FAQS = [
  {
    q: "How is the fare calculated in Coimbatore?",
    a: "Every CARRY vehicle has an upfront base fare which includes the first 2 km. Additional kilometers are billed at fixed per-km rates with zero surge pricing. Loading helpers have a clear flat fee.",
  },
  {
    q: "Can helpers carry goods up stairs without a lift?",
    a: "Yes. In the booking screen, specify the floor numbers for pickup and drop and whether a lift is available so the assigned helpers come prepared.",
  },
  {
    q: "What items can be moved with CARRY?",
    a: "Furniture, household appliances, boxes, raw materials, hardware, and shop stock. Hazardous, illegal, or flammable substances are strictly prohibited.",
  },
  {
    q: "How does live tracking work?",
    a: "Once a driver accepts your booking, you can track their route and status from assigned to pickup, in transit, and delivered directly in the app.",
  },
  {
    q: "What is CARRY's cancellation policy?",
    a: "Cancellation is 100% free within 5 minutes of booking, or anytime before a driver starts heading to your pickup location.",
  },
];

export default function CustomerSupportModal({ visible, onClose }: Props) {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);
  const [issueDescription, setIssueDescription] = useState("");
  const [showReportForm, setShowReportForm] = useState(false);

  const handleSubmitProblem = () => {
    if (!issueDescription.trim()) {
      Alert.alert("Description required", "Please describe your issue.");
      return;
    }
    Alert.alert(
      "Report Submitted",
      "Our Coimbatore support team will review your report within 2 hours."
    );
    setShowReportForm(false);
    setIssueDescription("");
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Pressable onPress={onClose} style={styles.backBtn}>
            <ArrowLeft size={22} color={colors.primaryBlack} />
          </Pressable>
          <Text style={styles.headerTitle}>Help & Support</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Quick Contact Cards */}
          <Text style={styles.sectionHeading}>Contact CARRY Coimbatore</Text>
          <View style={styles.contactGrid}>
            <CarryCard
              onPress={() => Alert.alert("Customer Care Helpline", "1800-419-CARRY (Toll-Free)")}
              style={styles.contactCard}
            >
              <View style={styles.contactIconCircle}>
                <Phone size={18} color={colors.primaryBlack} />
              </View>
              <Text style={styles.contactTitle}>Call Us</Text>
              <Text style={styles.contactSubtitle}>1800-419-CARRY</Text>
            </CarryCard>

            <CarryCard
              onPress={() => Alert.alert("WhatsApp Support", "Opening WhatsApp: +91 98430 21765")}
              style={styles.contactCard}
            >
              <View style={styles.contactIconCircle}>
                <MessageCircle size={18} color={colors.primaryBlack} />
              </View>
              <Text style={styles.contactTitle}>WhatsApp</Text>
              <Text style={styles.contactSubtitle}>Instant Chat</Text>
            </CarryCard>
          </View>

          {/* Report an Issue Action */}
          <CarryCard
            onPress={() => setShowReportForm((s) => !s)}
            style={styles.reportCard}
          >
            <View style={styles.reportRow}>
              <View style={styles.reportIcon}>
                <ShieldAlert size={18} color={colors.primaryBlack} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.reportTitle}>Report a Problem</Text>
                <Text style={styles.reportSub}>
                  Issues with a driver, delay, or goods handling
                </Text>
              </View>
            </View>

            {showReportForm && (
              <View style={styles.reportForm}>
                <TextInput
                  style={styles.reportInput}
                  placeholder="Describe what went wrong with your move..."
                  placeholderTextColor={colors.disabledGrey}
                  multiline
                  value={issueDescription}
                  onChangeText={setIssueDescription}
                />
                <CarryButton onPress={handleSubmitProblem} variant="primary" size="md">
                  Submit Report
                </CarryButton>
              </View>
            )}
          </CarryCard>

          {/* Frequently Asked Questions */}
          <Text style={styles.sectionHeading}>Frequently Asked Questions</Text>
          <View style={styles.faqList}>
            {FAQS.map((faq, index) => {
              const isOpen = expandedFaq === index;
              return (
                <CarryCard
                  key={index}
                  onPress={() => setExpandedFaq(isOpen ? null : index)}
                  style={styles.faqCard}
                >
                  <View style={styles.faqHeader}>
                    <Text style={styles.faqQuestion}>{faq.q}</Text>
                    {isOpen ? (
                      <ChevronUp size={18} color={colors.secondaryText} />
                    ) : (
                      <ChevronDown size={18} color={colors.secondaryText} />
                    )}
                  </View>
                  {isOpen && <Text style={styles.faqAnswer}>{faq.a}</Text>}
                </CarryCard>
              );
            })}
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
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
    backgroundColor: colors.cardSurface,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.lightGrey,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: colors.primaryBlack,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 36,
  },
  sectionHeading: {
    fontSize: 17,
    fontWeight: "800",
    color: colors.primaryBlack,
    marginBottom: 12,
    letterSpacing: -0.3,
  },
  contactGrid: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
  },
  contactCard: {
    flex: 1,
    padding: 16,
    alignItems: "center",
  },
  contactIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.lightGrey,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  contactTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: colors.primaryBlack,
  },
  contactSubtitle: {
    fontSize: 12,
    color: colors.secondaryText,
    marginTop: 4,
  },
  reportCard: {
    padding: 16,
    marginBottom: 24,
  },
  reportRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  reportIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.lightGrey,
    alignItems: "center",
    justifyContent: "center",
  },
  reportTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: colors.primaryBlack,
  },
  reportSub: {
    fontSize: 13,
    color: colors.secondaryText,
    marginTop: 2,
  },
  reportForm: {
    marginTop: 14,
    borderTopWidth: 1,
    borderTopColor: colors.borderGrey,
    paddingTop: 12,
    gap: 12,
  },
  reportInput: {
    backgroundColor: colors.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.borderGrey,
    padding: 12,
    height: 80,
    textAlignVertical: "top",
    fontSize: 14,
    color: colors.mainText,
  },
  faqList: {
    gap: 10,
  },
  faqCard: {
    padding: 16,
  },
  faqHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  faqQuestion: {
    flex: 1,
    fontSize: 15,
    fontWeight: "700",
    color: colors.mainText,
    marginRight: 10,
  },
  faqAnswer: {
    fontSize: 14,
    color: colors.secondaryText,
    lineHeight: 21,
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.borderGrey,
    paddingTop: 8,
  },
});
