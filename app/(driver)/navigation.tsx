import React from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { colors } from "../../src/theme/colors";
import Button from "../../src/components/ui/Button";

export default function DriverNavigationScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.content}>
        <View style={styles.turnCard}>
          <Text style={styles.turnArrow}>⬆️</Text>
          <View style={styles.turnInfo}>
            <Text style={styles.turnDistance}>In 400 meters</Text>
            <Text style={styles.turnInstruction}>Turn Right onto Cross Cut Road</Text>
          </View>
        </View>

        <View style={styles.mapSim}>
          <Text style={styles.mapIcon}>🗺️</Text>
          <Text style={styles.mapSimText}>Real-time GPS Turn-by-Turn Guidance</Text>
          <Text style={styles.mapCity}>Coimbatore Central Grid</Text>
        </View>

        <View style={styles.etaCard}>
          <View style={styles.etaItem}>
            <Text style={styles.etaLabel}>ETA</Text>
            <Text style={styles.etaValue}>12 min</Text>
          </View>
          <View style={styles.etaItem}>
            <Text style={styles.etaLabel}>DISTANCE</Text>
            <Text style={styles.etaValue}>4.2 km</Text>
          </View>
          <View style={styles.etaItem}>
            <Text style={styles.etaLabel}>SPEED</Text>
            <Text style={styles.etaValue}>28 km/h</Text>
          </View>
        </View>

        <Button
          title="Return to Trip Actions"
          size="large"
          onPress={() => router.back()}
          style={{ marginTop: 20, width: "100%" }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: "space-between",
  },
  turnCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.deepNavy,
    padding: 20,
    borderRadius: 18,
  },
  turnArrow: {
    fontSize: 32,
    marginRight: 16,
  },
  turnInfo: {
    flex: 1,
  },
  turnDistance: {
    fontSize: 13,
    color: "#94A3B8",
    fontWeight: "700",
    textTransform: "uppercase",
  },
  turnInstruction: {
    fontSize: 18,
    fontWeight: "800",
    color: "#FFFFFF",
    marginTop: 2,
  },
  mapSim: {
    flex: 1,
    backgroundColor: "#E2E8F0",
    borderRadius: 20,
    marginVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  mapIcon: {
    fontSize: 48,
    marginBottom: 8,
  },
  mapSimText: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.deepNavy,
  },
  mapCity: {
    fontSize: 13,
    color: colors.secondaryText,
    marginTop: 4,
  },
  etaCard: {
    flexDirection: "row",
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  etaItem: {
    flex: 1,
    alignItems: "center",
  },
  etaLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.secondaryText,
    letterSpacing: 0.5,
  },
  etaValue: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.deepNavy,
    marginTop: 4,
  },
});
