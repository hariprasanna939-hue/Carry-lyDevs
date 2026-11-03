import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { COIMBATORE_LOCALITIES } from "../../constants/coimbatore-areas";
import { colors } from "../../theme/colors";

interface Props {
  selectedLocalities: string[];
  onToggleLocality: (locality: string) => void;
  onSelectAll?: () => void;
}

export default function CoimbatoreAreaPicker({
  selectedLocalities,
  onToggleLocality,
  onSelectAll,
}: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Coimbatore Operating Localities</Text>
        {onSelectAll && (
          <TouchableOpacity onPress={onSelectAll}>
            <Text style={styles.selectAllText}>Select All ({COIMBATORE_LOCALITIES.length})</Text>
          </TouchableOpacity>
        )}
      </View>
      <Text style={styles.subtitle}>
        Select all areas across Coimbatore where you are willing to accept pickup and delivery trips.
      </Text>

      <View style={styles.chipsWrapper}>
        {COIMBATORE_LOCALITIES.map((loc) => {
          const isSelected = selectedLocalities.includes(loc);
          return (
            <TouchableOpacity
              key={loc}
              activeOpacity={0.7}
              onPress={() => onToggleLocality(loc)}
              style={[styles.chip, isSelected && styles.chipSelected]}
            >
              <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                {isSelected ? "✓ " : "+ "}
                {loc}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.deepNavy,
  },
  selectAllText: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.primary,
  },
  subtitle: {
    fontSize: 13,
    color: colors.secondaryText,
    marginBottom: 12,
    lineHeight: 18,
  },
  chipsWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#F1F5F9",
    borderWidth: 1,
    borderColor: "#CBD5E1",
  },
  chipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.deepNavy,
  },
  chipTextSelected: {
    color: "#FFFFFF",
  },
});
