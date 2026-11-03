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
import Input from "../../../src/components/ui/Input";
import { useAuth } from "../../../src/hooks/useAuth";

export default function DriverPersonalRegistrationScreen() {
  const router = useRouter();
  const { user } = useAuth();

  const [fullName, setFullName] = useState(user?.fullName || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [city, setCity] = useState("Coimbatore");
  const [emergencyContact, setEmergencyContact] = useState("");

  const handleNext = () => {
    router.push("/(driver)/registration/vehicle");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.stepIndicator}>Step 1 of 3: Personal Details</Text>
        <Text style={styles.title}>Partner Information</Text>
        <Text style={styles.subtitle}>Provide your contact information for registration</Text>

        <Input
          label="Full Legal Name"
          placeholder="As on Driving License"
          value={fullName}
          onChangeText={setFullName}
        />

        <Input
          label="Contact Mobile"
          placeholder="10-digit number"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />

        <Input
          label="Operational City"
          value={city}
          onChangeText={setCity}
          editable={false}
          hint="CARRY operates primarily in Coimbatore district"
        />

        <Input
          label="Emergency Contact Phone"
          placeholder="Relative or Family contact"
          value={emergencyContact}
          onChangeText={setEmergencyContact}
          keyboardType="phone-pad"
        />

        <Button
          title="Next: Vehicle Info →"
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
    marginBottom: 24,
  },
});
