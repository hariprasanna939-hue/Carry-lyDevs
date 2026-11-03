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
import Input from "../../../src/components/ui/Input";
import { bookingStore } from "../../../src/store/booking.store";
import RouteMap from "../../../src/components/maps/RouteMap";

export default function BookingLocationScreen() {
  const router = useRouter();
  const draft = bookingStore.getDraft();

  const [pickupAddress, setPickupAddress] = useState(
    draft.pickup?.address || "Gandhipuram Central, Coimbatore"
  );
  const [dropoffAddress, setDropoffAddress] = useState(
    draft.dropoff?.address || "Tidel Park, Peelamedu, Coimbatore"
  );
  const [pickupContact, setPickupContact] = useState(draft.pickup?.contactPhone || "");
  const [dropoffContact, setDropoffContact] = useState(draft.dropoff?.contactPhone || "");

  const handleNext = () => {
    if (!pickupAddress.trim() || !dropoffAddress.trim()) {
      Alert.alert("Missing Address", "Please provide both pickup and delivery locations.");
      return;
    }

    bookingStore.updateDraft({
      pickup: {
        address: pickupAddress.trim(),
        latitude: 11.0168,
        longitude: 76.9558,
        contactPhone: pickupContact,
      },
      dropoff: {
        address: dropoffAddress.trim(),
        latitude: 11.0285,
        longitude: 77.0275,
        contactPhone: dropoffContact,
      },
      estimatedDistanceKm: 7.5,
    });

    router.push("/(customer)/booking/vehicle");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Where are we moving cargo?</Text>
        <Text style={styles.subtitle}>Enter pickup point and destination address</Text>

        <View style={styles.formCard}>
          <View style={styles.inputSection}>
            <Text style={styles.dotPickup}>🟢 Pickup Location</Text>
            <Input
              placeholder="e.g. 124 Cross Cut Rd, Gandhipuram"
              value={pickupAddress}
              onChangeText={setPickupAddress}
            />
            <Input
              placeholder="Pickup contact phone (optional)"
              value={pickupContact}
              onChangeText={setPickupContact}
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.inputSection}>
            <Text style={styles.dotDropoff}>🔴 Drop-off Destination</Text>
            <Input
              placeholder="e.g. Tidel Park, Avinashi Rd, Peelamedu"
              value={dropoffAddress}
              onChangeText={setDropoffAddress}
            />
            <Input
              placeholder="Recipient contact phone (optional)"
              value={dropoffContact}
              onChangeText={setDropoffContact}
              keyboardType="phone-pad"
            />
          </View>
        </View>

        <RouteMap
          pickup={{ address: pickupAddress, latitude: 11.0168, longitude: 76.9558 }}
          dropoff={{ address: dropoffAddress, latitude: 11.0285, longitude: 77.0275 }}
        />

        <Button
          title="Choose Vehicle →"
          size="large"
          onPress={handleNext}
          style={{ marginTop: 12 }}
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
  formCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 18,
    borderWidth: 1.5,
    borderColor: colors.border,
    marginBottom: 16,
  },
  inputSection: {
    marginVertical: 4,
  },
  dotPickup: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.deepNavy,
    marginBottom: 8,
  },
  dotDropoff: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.deepNavy,
    marginBottom: 8,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 12,
  },
});
