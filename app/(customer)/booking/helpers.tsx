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
import { APP_CONFIG } from "../../../src/constants/config";

const HELPER_OPTIONS = [
  { count: 0, title: "No Helpers Needed", desc: "Self loading & unloading" },
  { count: 1, title: "+1 Helper", desc: `Assistance with heavy items (+₹${APP_CONFIG.helperRatePaise / 100})` },
  { count: 2, title: "+2 Helpers", desc: `Full shifting crew for bulky loads (+₹${(APP_CONFIG.helperRatePaise * 2) / 100})` },
];

export default function BookingHelpersScreen() {
  const router = useRouter();
  const draft = bookingStore.getDraft();
  const [helpersCount, setHelpersCount] = useState(draft.helpersCount || 0);

  const handleNext = () => {
    bookingStore.updateDraft({ helpersCount });
    router.push("/(customer)/booking/schedule");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Need Loading Help?</Text>
        <Text style={styles.subtitle}>
          Add verified helpers to load and unload goods safely at pickup and destination.
        </Text>

        {HELPER_OPTIONS.map((opt) => (
          <TouchableOpacity
            key={opt.count}
            style={[
              styles.optionCard,
              helpersCount === opt.count && styles.optionCardActive,
            ]}
            onPress={() => setHelpersCount(opt.count)}
          >
            <View style={styles.radio}>
              {helpersCount === opt.count ? <View style={styles.radioDot} /> : null}
            </View>
            <View style={styles.optionInfo}>
              <Text style={styles.optionTitle}>{opt.title}</Text>
              <Text style={styles.optionDesc}>{opt.desc}</Text>
            </View>
          </TouchableOpacity>
        ))}

        <Button
          title="Schedule Time →"
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
  optionCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: colors.border,
    marginBottom: 12,
  },
  optionCardActive: {
    borderColor: colors.primary,
    backgroundColor: colors.customerTint,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  radioDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary,
  },
  optionInfo: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.deepNavy,
  },
  optionDesc: {
    fontSize: 12,
    color: colors.secondaryText,
    marginTop: 2,
  },
});
