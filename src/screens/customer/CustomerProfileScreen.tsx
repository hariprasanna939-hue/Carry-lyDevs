import React, { useState } from "react";
import {
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  ChevronRight,
  CreditCard,
  FileText,
  HelpCircle,
  LogOut,
  MapPin,
  Shield,
  User,
} from "lucide-react-native";
import { useCarryAuth } from "../../auth/AuthContext";
import { CarryButton, CarryCard } from "../../components/CarryUI";
import CustomerPaymentModal from "./CustomerPaymentModal";
import CustomerSavedAddressesModal from "./CustomerSavedAddressesModal";
import CustomerSupportModal from "./CustomerSupportModal";
import { colors } from "../../theme/colors";

interface Props {
  onOpenAuth?: () => void;
}

export default function CustomerProfileScreen({ onOpenAuth }: Props) {
  const { profile, firebaseUser, logout } = useCarryAuth();
  const [showSavedAddresses, setShowSavedAddresses] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("cash");

  const handleLogout = () => {
    Alert.alert("Log Out", "Are you sure you want to log out of CARRY?", [
      { text: "Cancel", style: "cancel" },
      { text: "Log Out", style: "destructive", onPress: () => logout() },
    ]);
  };

  const initial = profile?.fullName
    ? profile.fullName.charAt(0).toUpperCase()
    : "C";

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.pageTitle}>Account & Settings</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Details Card */}
        <CarryCard style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initial}</Text>
          </View>

          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>
              {profile?.fullName || (firebaseUser ? "CARRY Customer" : "Guest Customer")}
            </Text>
            <Text style={styles.profilePhone}>
              {profile?.phone || (firebaseUser?.phoneNumber || "+91 98430 21765")}
            </Text>
            <Text style={styles.profileEmail}>
              {profile?.email || (firebaseUser?.email || "customer@carry.app")}
            </Text>
          </View>
        </CarryCard>

        {/* Guest sign in prompt if not logged in */}
        {!firebaseUser && (
          <CarryCard style={styles.signInCard}>
            <Text style={styles.signInTitle}>Sign in to save your moves</Text>
            <Text style={styles.signInSub}>
              Log in to sync addresses, track bookings live, and view receipts.
            </Text>
            <View style={{ marginTop: 12 }}>
              <CarryButton onPress={onOpenAuth} variant="primary" size="md">
                Sign In or Register
              </CarryButton>
            </View>
          </CarryCard>
        )}

        {/* Menu Options Group 1: Manage */}
        <Text style={styles.sectionTitle}>Manage Move Preferences</Text>
        <CarryCard style={styles.menuCard}>
          <Pressable
            onPress={() => setShowSavedAddresses(true)}
            style={styles.menuRow}
          >
            <View style={styles.menuIconBox}>
              <MapPin size={18} color={colors.primaryBlack} />
            </View>
            <View style={styles.menuTextCol}>
              <Text style={styles.menuLabel}>Saved Addresses</Text>
              <Text style={styles.menuDesc}>Home, office, warehouse</Text>
            </View>
            <ChevronRight size={18} color={colors.secondaryText} />
          </Pressable>

          <View style={styles.menuDivider} />

          <Pressable
            onPress={() => setShowPaymentModal(true)}
            style={styles.menuRow}
          >
            <View style={styles.menuIconBox}>
              <CreditCard size={18} color={colors.primaryBlack} />
            </View>
            <View style={styles.menuTextCol}>
              <Text style={styles.menuLabel}>Payment Methods</Text>
              <Text style={styles.menuDesc}>
                {selectedPaymentMethod === "cash"
                  ? "Cash on delivery"
                  : selectedPaymentMethod === "upi"
                  ? "UPI Payment"
                  : "Card"}
              </Text>
            </View>
            <ChevronRight size={18} color={colors.secondaryText} />
          </Pressable>
        </CarryCard>

        {/* Menu Options Group 2: Support & Legal */}
        <Text style={styles.sectionTitle}>Support & Legal</Text>
        <CarryCard style={styles.menuCard}>
          <Pressable
            onPress={() => setShowSupportModal(true)}
            style={styles.menuRow}
          >
            <View style={styles.menuIconBox}>
              <HelpCircle size={18} color={colors.primaryBlack} />
            </View>
            <View style={styles.menuTextCol}>
              <Text style={styles.menuLabel}>Help & Support</Text>
              <Text style={styles.menuDesc}>FAQs, call helpline & report issue</Text>
            </View>
            <ChevronRight size={18} color={colors.secondaryText} />
          </Pressable>

          <View style={styles.menuDivider} />

          <Pressable
            onPress={() => setShowTermsModal(true)}
            style={styles.menuRow}
          >
            <View style={styles.menuIconBox}>
              <FileText size={18} color={colors.primaryBlack} />
            </View>
            <View style={styles.menuTextCol}>
              <Text style={styles.menuLabel}>Terms & Privacy Policy</Text>
              <Text style={styles.menuDesc}>Service agreements & data policies</Text>
            </View>
            <ChevronRight size={18} color={colors.secondaryText} />
          </Pressable>
        </CarryCard>

        {/* Logout action */}
        {firebaseUser && (
          <CarryCard style={{ marginTop: 12 }}>
            <Pressable onPress={handleLogout} style={styles.logoutRow}>
              <LogOut size={18} color={colors.primaryBlack} />
              <Text style={styles.logoutText}>Log Out</Text>
            </Pressable>
          </CarryCard>
        )}

        <View style={styles.footerNote}>
          <Text style={styles.footerAppVersion}>CARRY v1.0 • Coimbatore</Text>
          <Text style={styles.footerTagline}>Move anything. Move smarter.</Text>
        </View>
      </ScrollView>

      {/* Modals */}
      <CustomerSavedAddressesModal
        visible={showSavedAddresses}
        onClose={() => setShowSavedAddresses(false)}
      />

      <CustomerPaymentModal
        visible={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        selectedMethod={selectedPaymentMethod}
        onSelectMethod={setSelectedPaymentMethod}
      />

      <CustomerSupportModal
        visible={showSupportModal}
        onClose={() => setShowSupportModal(false)}
      />

      {/* Terms & Privacy Modal */}
      <Modal
        visible={showTermsModal}
        animationType="slide"
        onRequestClose={() => setShowTermsModal(false)}
      >
        <View style={styles.termsModalContainer}>
          <View style={styles.header}>
            <Text style={styles.pageTitle}>Terms & Privacy</Text>
            <Pressable onPress={() => setShowTermsModal(false)}>
              <Text style={styles.termsCloseText}>Close</Text>
            </Pressable>
          </View>
          <ScrollView contentContainerStyle={styles.termsScroll}>
            <Text style={styles.termsH1}>1. Service Agreement</Text>
            <Text style={styles.termsP}>
              CARRY operates as a logistics facilitation platform in Coimbatore, Tamil Nadu, connecting verified vehicle partners with customers. All fares are calculated upfront with zero hidden charges.
            </Text>

            <Text style={styles.termsH1}>2. Loading & Helper Policy</Text>
            <Text style={styles.termsP}>
              When booking helpers, customers must specify elevator access and accurate floor numbers. Drivers and helpers reserve the right to verify cargo safety prior to transit.
            </Text>

            <Text style={styles.termsH1}>3. Privacy & Personal Data</Text>
            <Text style={styles.termsP}>
              Phone numbers and pickup/drop coordinates are shared strictly with the assigned driver for the duration of the trip and are never sold or shared with external parties.
            </Text>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: colors.cardSurface,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderGrey,
  },
  pageTitle: {
    fontSize: 26,
    fontWeight: "900",
    color: colors.primaryBlack,
    letterSpacing: -0.8,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 36,
  },
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    padding: 18,
    marginBottom: 20,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primaryBlack,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 24,
    fontWeight: "900",
    color: colors.white,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.primaryBlack,
  },
  profilePhone: {
    fontSize: 13,
    color: colors.secondaryText,
    marginTop: 2,
  },
  profileEmail: {
    fontSize: 13,
    color: colors.secondaryText,
  },
  signInCard: {
    padding: 16,
    marginBottom: 20,
    borderColor: colors.primaryBlack,
    borderWidth: 1.5,
  },
  signInTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: colors.primaryBlack,
  },
  signInSub: {
    fontSize: 13,
    color: colors.secondaryText,
    marginTop: 4,
    lineHeight: 18,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: colors.primaryBlack,
    marginTop: 10,
    marginBottom: 10,
    letterSpacing: -0.2,
  },
  menuCard: {
    paddingHorizontal: 16,
    paddingVertical: 4,
    marginBottom: 14,
  },
  menuRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingVertical: 14,
  },
  menuIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.lightGrey,
    alignItems: "center",
    justifyContent: "center",
  },
  menuTextCol: {
    flex: 1,
  },
  menuLabel: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.primaryBlack,
  },
  menuDesc: {
    fontSize: 12,
    color: colors.secondaryText,
    marginTop: 2,
  },
  menuDivider: {
    height: 1,
    backgroundColor: colors.borderGrey,
    marginLeft: 50,
  },
  logoutRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 14,
  },
  logoutText: {
    fontSize: 15,
    fontWeight: "800",
    color: colors.primaryBlack,
  },
  footerNote: {
    alignItems: "center",
    marginTop: 28,
    marginBottom: 10,
    gap: 4,
  },
  footerAppVersion: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.secondaryText,
  },
  footerTagline: {
    fontSize: 12,
    color: colors.disabledGrey,
  },
  termsModalContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  termsCloseText: {
    fontSize: 15,
    fontWeight: "800",
    color: colors.primaryBlack,
  },
  termsScroll: {
    padding: 24,
    gap: 12,
  },
  termsH1: {
    fontSize: 17,
    fontWeight: "800",
    color: colors.primaryBlack,
    marginTop: 8,
  },
  termsP: {
    fontSize: 14,
    color: colors.mainText,
    lineHeight: 22,
  },
});
