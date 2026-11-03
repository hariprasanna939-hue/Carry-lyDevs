import React, { useState } from "react";
import {
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ArrowLeft,
  Banknote,
  Check,
  CreditCard,
  QrCode,
  ShieldCheck,
  Smartphone,
} from "lucide-react-native";
import { CarryButton, CarryCard } from "../../components/CarryUI";
import { colors } from "../../theme/colors";

interface Props {
  visible: boolean;
  onClose: () => void;
  selectedMethod: string;
  onSelectMethod: (method: string) => void;
  totalFarePaise?: number;
}

const PAYMENT_METHODS = [
  {
    id: "cash",
    name: "Cash on Unloading",
    description: "Pay driver directly after goods are safely delivered",
    icon: Banknote,
  },
  {
    id: "upi",
    name: "UPI (GPay / PhonePe / Paytm)",
    description: "Instant QR code scan or UPI ID payment",
    icon: Smartphone,
  },
  {
    id: "card",
    name: "Credit or Debit Card",
    description: "Visa, Mastercard, RuPay & Corporate cards",
    icon: CreditCard,
  },
];

export default function CustomerPaymentModal({
  visible,
  onClose,
  selectedMethod,
  onSelectMethod,
  totalFarePaise = 39900,
}: Props) {
  const [activeId, setActiveId] = useState(selectedMethod || "cash");

  const formatINR = (paise: number) => `₹${Math.round(paise / 100)}`;

  const handleApply = () => {
    onSelectMethod(activeId);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Pressable onPress={onClose} style={styles.backBtn}>
            <ArrowLeft size={22} color={colors.primaryBlack} />
          </Pressable>
          <Text style={styles.headerTitle}>Payment Options</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Fare Payout Summary Card */}
          <CarryCard style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Total Payable Fare</Text>
            <Text style={styles.summaryAmount}>{formatINR(totalFarePaise)}</Text>
            <Text style={styles.summaryNote}>
              Inclusive of base fare, distance & loading helpers
            </Text>
          </CarryCard>

          {/* Payment Methods List */}
          <Text style={styles.sectionTitle}>Select Payment Method</Text>

          <View style={styles.methodsList}>
            {PAYMENT_METHODS.map((item) => {
              const IconComp = item.icon;
              const isSelected = activeId === item.id;

              return (
                <CarryCard
                  key={item.id}
                  onPress={() => setActiveId(item.id)}
                  style={[
                    styles.methodCard,
                    isSelected && styles.methodCardSelected,
                  ]}
                >
                  <View style={styles.methodRow}>
                    <View
                      style={[
                        styles.iconCircle,
                        isSelected && styles.iconCircleActive,
                      ]}
                    >
                      <IconComp
                        size={20}
                        color={isSelected ? colors.white : colors.primaryBlack}
                      />
                    </View>

                    <View style={styles.methodInfo}>
                      <Text style={styles.methodName}>{item.name}</Text>
                      <Text style={styles.methodDesc}>{item.description}</Text>
                    </View>

                    <View
                      style={[
                        styles.radioCircle,
                        isSelected && styles.radioCircleSelected,
                      ]}
                    >
                      {isSelected && <View style={styles.radioDot} />}
                    </View>
                  </View>
                </CarryCard>
              );
            })}
          </View>

          <View style={styles.securityRow}>
            <ShieldCheck size={18} color={colors.success} />
            <Text style={styles.securityText}>
              All transactions are encrypted and secured for Coimbatore local deliveries.
            </Text>
          </View>
        </ScrollView>

        <View style={styles.bottomBar}>
          <CarryButton onPress={handleApply} variant="primary">
            Confirm Payment Method
          </CarryButton>
        </View>
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
  summaryCard: {
    padding: 20,
    alignItems: "center",
    marginBottom: 24,
  },
  summaryLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.secondaryText,
  },
  summaryAmount: {
    fontSize: 34,
    fontWeight: "900",
    color: colors.primaryBlack,
    letterSpacing: -1,
    marginVertical: 4,
  },
  summaryNote: {
    fontSize: 12,
    color: colors.secondaryText,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: colors.primaryBlack,
    marginBottom: 12,
    letterSpacing: -0.3,
  },
  methodsList: {
    gap: 12,
    marginBottom: 20,
  },
  methodCard: {
    padding: 16,
    borderWidth: 1.5,
    borderColor: colors.borderGrey,
  },
  methodCardSelected: {
    borderColor: colors.primaryBlack,
  },
  methodRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  iconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.lightGrey,
    alignItems: "center",
    justifyContent: "center",
  },
  iconCircleActive: {
    backgroundColor: colors.primaryBlack,
  },
  methodInfo: {
    flex: 1,
  },
  methodName: {
    fontSize: 15,
    fontWeight: "800",
    color: colors.primaryBlack,
  },
  methodDesc: {
    fontSize: 12,
    color: colors.secondaryText,
    marginTop: 2,
    lineHeight: 16,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: colors.disabledGrey,
    alignItems: "center",
    justifyContent: "center",
  },
  radioCircleSelected: {
    borderColor: colors.primaryBlack,
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primaryBlack,
  },
  securityRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 8,
  },
  securityText: {
    fontSize: 12,
    color: colors.secondaryText,
    flex: 1,
    lineHeight: 17,
  },
  bottomBar: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: colors.borderGrey,
    backgroundColor: colors.cardSurface,
  },
});
