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
import Input from "../../../src/components/ui/Input";
import { bookingStore } from "../../../src/store/booking.store";

const CARGO_CATEGORIES = [
  "Furniture & Home Shifting",
  "Electronics & Appliances",
  "Hardware & Construction",
  "Textiles & Garments",
  "Commercial / FMCG Goods",
  "Machinery & Industrial",
  "Other Cargo",
];

export default function BookingItemsScreen() {
  const router = useRouter();
  const draft = bookingStore.getDraft();

  const [selectedCategory, setSelectedCategory] = useState(
    draft.cargo?.category || CARGO_CATEGORIES[0]
  );
  const [description, setDescription] = useState(draft.cargo?.description || "");
  const [isFragile, setIsFragile] = useState(draft.cargo?.isFragile || false);

  const handleNext = () => {
    bookingStore.updateDraft({
      cargo: {
        category: selectedCategory,
        description: description.trim(),
        isFragile,
      },
    });
    router.push("/(customer)/booking/helpers");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>What are you transporting?</Text>
        <Text style={styles.subtitle}>Select commodity type to help driver prepare</Text>

        <View style={styles.categoryContainer}>
          {CARGO_CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[
                styles.categoryChip,
                selectedCategory === cat && styles.categoryChipActive,
              ]}
              onPress={() => setSelectedCategory(cat)}
            >
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === cat && styles.categoryTextActive,
                ]}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Input
          label="Item Description (Optional)"
          placeholder="e.g. 1 Bed, 1 Washing Machine, 4 Cardboard boxes"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={3}
          style={{ height: 80, textAlignVertical: "top" }}
        />

        <TouchableOpacity
          style={styles.fragileToggle}
          activeOpacity={0.8}
          onPress={() => setIsFragile(!isFragile)}
        >
          <View style={[styles.checkbox, isFragile && styles.checkboxActive]}>
            {isFragile ? <Text style={styles.checkmark}>✓</Text> : null}
          </View>
          <View style={styles.fragileInfo}>
            <Text style={styles.fragileTitle}>Fragile / Handle with Extra Care</Text>
            <Text style={styles.fragileDesc}>Alerts driver to drive carefully and secure cargo</Text>
          </View>
        </TouchableOpacity>

        <Button
          title="Loading Assistance →"
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
    marginBottom: 16,
  },
  categoryContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 20,
  },
  categoryChip: {
    backgroundColor: colors.surface,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  categoryChipActive: {
    borderColor: colors.primary,
    backgroundColor: colors.customerTint,
  },
  categoryText: {
    fontSize: 13,
    color: colors.secondaryText,
    fontWeight: "600",
  },
  categoryTextActive: {
    color: colors.primary,
    fontWeight: "700",
  },
  fragileToggle: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: colors.border,
    marginTop: 8,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  checkboxActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  checkmark: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
  },
  fragileInfo: {
    flex: 1,
  },
  fragileTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.deepNavy,
  },
  fragileDesc: {
    fontSize: 12,
    color: colors.secondaryText,
    marginTop: 2,
  },
});
