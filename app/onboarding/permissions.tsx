import React from "react";
import { View, Text, StyleSheet, SafeAreaView } from "react-native";
import { useRouter } from "expo-router";
import { colors } from "../../src/theme/colors";
import Button from "../../src/components/ui/Button";

export default function PermissionsScreen() {
  const router = useRouter();

  const handleGrant = () => {
    router.replace("/(auth)/login");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.icon}>📍</Text>
        <Text style={styles.title}>Enable Location Services</Text>
        <Text style={styles.description}>
          CARRY needs location access to find nearby mini-trucks, calculate exact driving distance, and provide real-time trip tracking.
        </Text>
      </View>
      <View style={styles.footer}>
        <Button
          title="Enable Location"
          size="large"
          onPress={handleGrant}
        />
        <Button
          title="Not Now"
          variant="outline"
          style={{ marginTop: 12 }}
          onPress={() => router.replace("/(auth)/login")}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  icon: {
    fontSize: 54,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: colors.deepNavy,
    textAlign: "center",
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    color: colors.secondaryText,
    textAlign: "center",
    lineHeight: 22,
  },
  footer: {
    padding: 24,
  },
});
