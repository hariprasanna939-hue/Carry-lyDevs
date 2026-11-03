import React from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { colors } from "../../src/theme/colors";

export default function TermsScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.heading}>CARRY Logistics Terms of Service</Text>
        <Text style={styles.updated}>Last updated: November 2026</Text>

        <Text style={styles.sectionTitle}>1. Scope of Service</Text>
        <Text style={styles.paragraph}>
          CARRY operates an online marketplace technology connecting shippers (customers) with commercial goods vehicle drivers and logistics partners in the Coimbatore metropolitan area.
        </Text>

        <Text style={styles.sectionTitle}>2. Cargo Compliance</Text>
        <Text style={styles.paragraph}>
          Users agree not to transport any prohibited, flammable, hazardous, illicit, or illegal goods under the Motor Vehicles Act and Indian law.
        </Text>

        <Text style={styles.sectionTitle}>3. Pricing & Tolls</Text>
        <Text style={styles.paragraph}>
          Fares displayed before booking include estimated distance and helper charges. Additional toll taxes and parking fees incurred during transit are payable by the customer upon delivery.
        </Text>

        <Text style={styles.sectionTitle}>4. Cancellations</Text>
        <Text style={styles.paragraph}>
          Cancellations requested after driver dispatch or arrival at pickup may incur a nominal cancellation fee to compensate the driver partner.
        </Text>
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
  },
  heading: {
    fontSize: 22,
    fontWeight: "800",
    color: colors.deepNavy,
    marginBottom: 4,
  },
  updated: {
    fontSize: 12,
    color: colors.secondaryText,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.deepNavy,
    marginTop: 16,
    marginBottom: 6,
  },
  paragraph: {
    fontSize: 14,
    color: colors.secondaryText,
    lineHeight: 22,
  },
});
