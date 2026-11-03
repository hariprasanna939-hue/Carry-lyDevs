import React, { useState } from "react";
import {
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
import { bookingStore } from "../../../src/store/booking.store";

export default function BookingScheduleScreen() {
  const router = useRouter();
  const draft = bookingStore.getDraft();
  const [isInstant, setIsInstant] = useState(draft.isInstant ?? true);
  const [scheduledSlot, setScheduledSlot] = useState("Today, 3:00 PM - 4:00 PM");

  const SLOTS = [
    "Today, 3:00 PM - 4:00 PM",
    "Today, 5:00 PM - 6:00 PM",
    "Tomorrow, 9:00 AM - 10:00 AM",
    "Tomorrow, 11:00 AM - 12:00 PM",
    "Tomorrow, 2:00 PM - 3:00 PM",
  ];

  const handleNext = () => {
    bookingStore.updateDraft({
      isInstant,
      scheduledTime: isInstant ? null : scheduledSlot,
    });
    router.push("/(customer)/booking/fare");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Pickup Time</Text>
        <Text style={styles.subtitle}>Choose instant dispatch or book in advance</Text>

        <TouchableOpacity
          style={[styles.typeCard, isInstant && styles.typeCardActive]}
          onPress={() => setIsInstant(true)}
        >
          <Text style={styles.typeIcon}>⚡</Text>
          <View style={styles.typeInfo}>
            <Text style={styles.typeTitle}>Send Instantly (Within 10-15 mins)</Text>
            <Text style={styles.typeDesc}>Nearest available mini-truck will be assigned immediately</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.typeCard, !isInstant && styles.typeCardActive]}
          onPress={() => setIsInstant(false)}
        >
          <Text style={styles.typeIcon}>📅</Text>
          <View style={styles.typeInfo}>
            <Text style={styles.typeTitle}>Schedule for Later</Text>
            <Text style={styles.typeDesc}>Reserve truck for a planned home shifting or delivery</Text>
          </View>
        </TouchableOpacity>

        {!isInstant ? (
          <View style={styles.slotPicker}>
            <Text style={styles.slotTitle}>Select Preferred Window</Text>
            {SLOTS.map((slot) => (
              <TouchableOpacity
                key={slot}
                style={[
                  styles.slotItem,
                  scheduledSlot === slot && styles.slotItemActive,
                ]}
                onPress={() => setScheduledSlot(slot)}
              >
                <Text
                  style={[
                    styles.slotText,
                    scheduledSlot === slot && styles.slotTextActive,
                  ]}
                >
                  {slot}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        ) : null}

        <Button
          title="Review Fare →"
          size="large"
          onPress={handleNext}
          style={{ marginTop: 24 }}
        />
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
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: colors.deepNavy,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: colors.secondaryText,
    marginBottom: 20,
  },
  typeCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: colors.border,
    marginBottom: 12,
  },
  typeCardActive: {
    borderColor: colors.primary,
    backgroundColor: colors.customerTint,
  },
  typeIcon: {
    fontSize: 26,
    marginRight: 14,
  },
  typeInfo: {
    flex: 1,
  },
  typeTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.deepNavy,
  },
  typeDesc: {
    fontSize: 12,
    color: colors.secondaryText,
    marginTop: 2,
  },
  slotPicker: {
    marginTop: 12,
  },
  slotTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.secondaryText,
    textTransform: "uppercase",
    marginBottom: 8,
  },
  slotItem: {
    backgroundColor: colors.surface,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.border,
    marginBottom: 8,
  },
  slotItemActive: {
    borderColor: colors.primary,
    backgroundColor: colors.customerTint,
  },
  slotText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: "500",
  },
  slotTextActive: {
    color: colors.primary,
    fontWeight: "700",
  },
});
