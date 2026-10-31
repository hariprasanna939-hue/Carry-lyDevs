import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useCarryAuth } from "../auth/AuthContext";
import CarryButton from "../components/CarryButton";
import { colors } from "../theme/colors";

interface Props {
  onSwitchPortal: () => void;
}

export default function CustomerHomeScreen({ onSwitchPortal }: Props) {
  const { profile, logout } = useCarryAuth();

  if (!profile) return null;

  return (
    <ScrollView
      style={styles.flex}
      contentContainerStyle={styles.container}
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.brand}>carry</Text>
          <Text style={styles.welcome}>
            Hello, {profile.fullName}
          </Text>
        </View>
        <Text style={styles.location}>Coimbatore 📍</Text>
      </View>

      <View style={styles.hero}>
        <Text style={styles.heroTitle}>
          What do you need to move?
        </Text>
        <Text style={styles.heroDescription}>
          Book a vehicle for your household goods, furniture and everyday deliveries.
        </Text>
        <View style={styles.comingSoon}>
          <Text style={styles.comingSoonText}>
            Booking experience coming in Phase 2
          </Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Choose your service</Text>

      <View style={styles.serviceCard}>
        <Text style={styles.serviceIcon}>🚚</Text>
        <Text style={styles.serviceTitle}>Mini van</Text>
        <Text style={styles.serviceDescription}>
          Small room moves and everyday goods.
        </Text>
      </View>

      <View style={styles.serviceCard}>
        <Text style={styles.serviceIcon}>🚛</Text>
        <Text style={styles.serviceTitle}>Larger vehicle</Text>
        <Text style={styles.serviceDescription}>
          Bigger household moves and bulky goods.
        </Text>
      </View>

      <View style={styles.serviceCard}>
        <Text style={styles.serviceIcon}>🛋️</Text>
        <Text style={styles.serviceTitle}>Furniture shifting</Text>
        <Text style={styles.serviceDescription}>
          Sofas, appliances, tables and furniture.
        </Text>
      </View>

      <Text style={styles.sectionTitle}>Your account</Text>

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
    padding: 22,
    paddingTop: 58,
    paddingBottom: 40,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  brand: {
    fontSize: 31,
    fontWeight: "800",
    color: colors.primary,
  },
  welcome: {
    color: colors.secondaryText,
    marginTop: 4,
    fontSize: 13,
  },
  location: {
    color: colors.text,
    fontWeight: "600",
    fontSize: 12,
  },
  hero: {
    backgroundColor: "#25204D",
    padding: 23,
    borderRadius: 23,
    marginTop: 27,
  },
  heroTitle: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "800",
    lineHeight: 31,
  },
  heroDescription: {
    color: "#D8D5F0",
    fontSize: 13,
    lineHeight: 21,
    marginTop: 10,
  },
  comingSoon: {
    backgroundColor: "#FFFFFF",
    borderRadius: 11,
    padding: 11,
    marginTop: 19,
  },
  comingSoonText: {
    color: colors.primary,
    textAlign: "center",
    fontSize: 12,
    fontWeight: "700",
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 19,
    fontWeight: "800",
    marginTop: 28,
    marginBottom: 14,
  },
  serviceCard: {
    backgroundColor: colors.surface,
    padding: 18,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 11,
  },
  serviceIcon: {
    fontSize: 27,
  },
  serviceTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.text,
    marginTop: 10,
  },
  serviceDescription: {
    fontSize: 12,
    color: colors.secondaryText,
    marginTop: 5,
  },
  spacer: {
    height: 12,
  },
});
