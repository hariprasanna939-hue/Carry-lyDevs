import React, { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { colors } from "../../../src/theme/colors";
import Button from "../../../src/components/ui/Button";
import { bookingStore } from "../../../src/store/booking.store";
import { COIMBATORE_VEHICLE_CATEGORIES } from "../../../src/constants/vehicles";
import VehicleCard from "../../../src/components/booking/VehicleCard";
import { pricingService } from "../../../src/features/pricing/pricing.service";

export default function BookingVehicleScreen() {
  const router = useRouter();
  const draft = bookingStore.getDraft();
  const [selectedVehicleId, setSelectedVehicleId] = useState(
    draft.vehicleCategoryId || "tata_ace"
  );

  const handleNext = () => {
    const fare = pricingService.calculateFare({
      vehicleId: selectedVehicleId,
      distanceKm: draft.estimatedDistanceKm || 5,
      helpersCount: draft.helpersCount || 0,
    });

    bookingStore.updateDraft({
      vehicleCategoryId: selectedVehicleId,
      fareBreakdown: fare,
    });

    router.push("/(customer)/booking/items");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Select Vehicle Capacity</Text>
        <Text style={styles.subtitle}>
          Rates calculated for approx {draft.estimatedDistanceKm || 5} km journey
        </Text>

        {COIMBATORE_VEHICLE_CATEGORIES.map((vehicle) => {
          const fare = pricingService.calculateFare({
            vehicleId: vehicle.id,
            distanceKm: draft.estimatedDistanceKm || 5,
            helpersCount: draft.helpersCount || 0,
          });

          return (
            <VehicleCard
              key={vehicle.id}
              vehicle={vehicle}
              isSelected={selectedVehicleId === vehicle.id}
              onSelect={() => setSelectedVehicleId(vehicle.id)}
              estimatedPricePaise={fare.totalFarePaise}
            />
          );
        })}

        <Button
          title="Cargo Details →"
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
});
