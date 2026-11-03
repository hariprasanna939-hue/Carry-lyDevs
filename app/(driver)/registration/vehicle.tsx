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
import { COIMBATORE_VEHICLE_CATEGORIES } from "../../../src/constants/vehicles";

export default function DriverVehicleRegistrationScreen() {
  const router = useRouter();
  const [vehicleCategory, setVehicleCategory] = useState("tata_ace");
  const [plateNumber, setPlateNumber] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("2022");

  const handleNext = () => {
    router.push("/(driver)/registration/documents");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.stepIndicator}>Step 2 of 3: Vehicle Specs</Text>
        <Text style={styles.title}>Vehicle Information</Text>
        <Text style={styles.subtitle}>Enter the truck or commercial vehicle details</Text>

        <Text style={styles.sectionLabel}>Vehicle Category</Text>
        <View style={styles.categoryGrid}>
          {COIMBATORE_VEHICLE_CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={[
                styles.categoryCard,
                vehicleCategory === cat.id && styles.categoryCardActive,
              ]}
              onPress={() => setVehicleCategory(cat.id)}
            >
              <Text style={styles.categoryIcon}>{cat.icon}</Text>
              <Text
                style={[
                  styles.categoryName,
                  vehicleCategory === cat.id && styles.categoryNameActive,
                ]}
              >
                {cat.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Input
          label="Registration Number (Plate)"
          placeholder="e.g. TN-38-AB-1234"
          value={plateNumber}
          onChangeText={setPlateNumber}
          autoCapitalize="characters"
        />

        <Input
          label="Vehicle Model"
          placeholder="e.g. Tata Ace Gold / Mahindra Bolero Maxi"
          value={model}
          onChangeText={setModel}
        />

        <Input
          label="Registration Year"
          placeholder="e.g. 2021"
          value={year}
          onChangeText={setYear}
          keyboardType="numeric"
        />

        <Button
          title="Next: KYC Documents →"
          size="large"
          onPress={handleNext}
          style={{ marginTop: 16 }}
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
  sectionLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.deepNavy,
    textTransform: "uppercase",
    marginBottom: 8,
  },
  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 20,
  },
  categoryCard: {
    width: "48%",
    backgroundColor: colors.background,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: "center",
  },
  categoryCardActive: {
    borderColor: colors.primary,
    backgroundColor: colors.driverTint,
  },
  categoryIcon: {
    fontSize: 26,
    marginBottom: 6,
  },
  categoryName: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.secondaryText,
    textAlign: "center",
  },
  categoryNameActive: {
    color: colors.primary,
    fontWeight: "700",
  },
});
