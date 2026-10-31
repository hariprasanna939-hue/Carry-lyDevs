import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useCarryAuth } from "../auth/AuthContext";
import CarryButton from "../components/CarryButton";
import { colors } from "../theme/colors";

interface Props {
  onSwitchPortal: () => void;
}

export default function DriverHomeScreen({ onSwitchPortal }: Props) {
  const { profile, logout } = useCarryAuth();

  if (!profile) return null;

  return (
    <ScrollView
      style={styles.flex}
      contentContainerStyle={styles.container}
    >
      <Text style={styles.brand}>carry</Text>
      <Text style={styles.title}>Driver portal</Text>
      <Text style={styles.welcome}>
        Welcome, {profile.fullName}
      </Text>

      <View style={styles.statusCard}>
        <Text style={styles.statusTitle}>
          Driver account verified
        </Text>
        <Text style={styles.statusDescription}>
          Your account is approved. Job requests and online availability will be enabled in a later phase.
        </Text>
        <Text style={styles.city}>
          Service area · Coimbatore
        </Text>
      </View>

      <Text style={styles.sectionTitle}>Driver dashboard</Text>

      <View style={styles.metric}>
        <Text style={styles.metricValue}>—</Text>
        <Text style={styles.metricLabel}>Today's trips</Text>
      </View>

      <View style={styles.metric}>
        <Text style={styles.metricValue}>—</Text>
        <Text style={styles.metricLabel}>Today's earnings</Text>
      </View>

      <Text style={styles.note}>
        No sample trips or earnings are displayed. Connect the real job and earnings modules in a later phase.
      </Text>

      <CarryButton
        title="Switch portal"
        onPress={onSwitchPortal}
        secondary
      />
      <View style={styles.spacer} />
      <CarryButton title="Sign out" onPress={logout} secondary />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    padding: 23,
    paddingTop: 58,
    paddingBottom: 40,
  },
  brand: {
    color: colors.primary,
    fontSize: 32,
    fontWeight: "800",
  },
  title: {
    fontSize: 25,
    color: colors.text,
    fontWeight: "800",
    marginTop: 25,
  },
  welcome: {
    fontSize: 14,
    color: colors.secondaryText,
    marginTop: 7,
  },
  statusCard: {
    backgroundColor: "#ECFDF5",
    borderWidth: 1,
    borderColor: "#C6F0DD",
    padding: 19,
    borderRadius: 20,
    marginTop: 25,
  },
  statusTitle: {
    color: "#08764D",
    fontSize: 17,
    fontWeight: "800",
  },
  statusDescription: {
    color: "#477966",
    fontSize: 13,
    lineHeight: 20,
    marginTop: 8,
  },
  city: {
    color: "#08764D",
    fontSize: 12,
    fontWeight: "700",
    marginTop: 14,
  },
  sectionTitle: {
    fontSize: 19,
    fontWeight: "800",
    color: colors.text,
    marginTop: 28,
    marginBottom: 13,
  },
  metric: {
    backgroundColor: colors.surface,
    borderRadius: 17,
    padding: 19,
    marginBottom: 11,
    borderWidth: 1,
    borderColor: colors.border,
  },
  metricValue: {
    fontSize: 26,
    fontWeight: "800",
    color: colors.text,
  },
  metricLabel: {
    color: colors.secondaryText,
    fontSize: 12,
    marginTop: 4,
  },
  note: {
    color: colors.secondaryText,
    fontSize: 12,
    lineHeight: 19,
    marginVertical: 17,
  },
  spacer: {
    height: 13,
  },
});
