import React from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { colors } from "../../src/theme/colors";
import Button from "../../src/components/ui/Button";

export default function DriverEarningsScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>AVAILABLE FOR PAYOUT</Text>
          <Text style={styles.balanceValue}>₹4,850</Text>
          <Text style={styles.payoutSchedule}>Auto-transfers every Tuesday to Bank Account</Text>
          <Button
            title="Instant Bank Transfer"
            size="medium"
            style={{ marginTop: 16, backgroundColor: colors.surface }}
            textStyle={{ color: colors.deepNavy }}
            onPress={() => {}}
          />
        </View>

        <Text style={styles.sectionTitle}>Weekly Summary</Text>
        <View style={styles.summaryRow}>
          <View style={styles.summaryItem}>
            <Text style={styles.sumVal}>₹12,400</Text>
            <Text style={styles.sumLabel}>Total Earned</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.sumVal}>28</Text>
            <Text style={styles.sumLabel}>Loads Delivered</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.sumVal}>38.5h</Text>
            <Text style={styles.sumLabel}>Online Hours</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Recent Trip Payouts</Text>
        {[
          { id: "1", time: "Today, 11:30 AM", fare: "₹420", type: "Tata Ace • 6.2 km" },
          { id: "2", time: "Today, 09:15 AM", fare: "₹310", type: "3-Wheeler Cargo • 3.8 km" },
          { id: "3", time: "Yesterday, 04:45 PM", fare: "₹720", type: "Bolero Pickup • 11.5 km" },
        ].map((item) => (
          <View key={item.id} style={styles.payoutCard}>
            <View>
              <Text style={styles.payoutType}>{item.type}</Text>
              <Text style={styles.payoutTime}>{item.time}</Text>
            </View>
            <Text style={styles.payoutFare}>{item.fare}</Text>
          </View>
        ))}
      </ScrollView>
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
  balanceCard: {
    backgroundColor: colors.primaryDark,
    padding: 24,
    borderRadius: 20,
    marginBottom: 24,
  },
  balanceLabel: {
    fontSize: 11,
    fontWeight: "800",
    color: "#C7D2FE",
    letterSpacing: 0.5,
  },
  balanceValue: {
    fontSize: 36,
    fontWeight: "900",
    color: "#FFFFFF",
    marginVertical: 4,
  },
  payoutSchedule: {
    fontSize: 12,
    color: "#E0E7FF",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: colors.deepNavy,
    marginBottom: 12,
    marginTop: 4,
  },
  summaryRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 24,
  },
  summaryItem: {
    flex: 1,
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: "center",
  },
  sumVal: {
    fontSize: 17,
    fontWeight: "800",
    color: colors.deepNavy,
  },
  sumLabel: {
    fontSize: 11,
    color: colors.secondaryText,
    marginTop: 4,
  },
  payoutCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: colors.border,
    marginBottom: 10,
  },
  payoutType: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.deepNavy,
  },
  payoutTime: {
    fontSize: 12,
    color: colors.secondaryText,
    marginTop: 2,
  },
  payoutFare: {
    fontSize: 16,
    fontWeight: "800",
    color: colors.success,
  },
});
