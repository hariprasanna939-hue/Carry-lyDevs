import React, { useState } from "react";
import {
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ArrowLeft,
  Briefcase,
  Building,
  Check,
  Home,
  MapPin,
  Plus,
  Trash2,
  X,
} from "lucide-react-native";
import { CarryButton, CarryCard } from "../../components/CarryUI";
import { colors } from "../../theme/colors";

export interface SavedAddress {
  id: string;
  type: "home" | "work" | "warehouse" | "other";
  name: string;
  address: string;
  landmark?: string;
  contactName: string;
  contactPhone: string;
}

interface Props {
  visible: boolean;
  onClose: () => void;
  onSelectAddress?: (addressText: string) => void;
}

const INITIAL_ADDRESSES: SavedAddress[] = [
  {
    id: "1",
    type: "home",
    name: "Home",
    address: "142 Bharathiyar St, Gandhipuram, Coimbatore",
    landmark: "Near Cross Cut Bus Stand",
    contactName: "Arun Kumar",
    contactPhone: "+91 98430 21765",
  },
  {
    id: "2",
    type: "work",
    name: "Office / Studio",
    address: "4th Floor, Hanudev Info Park, Peelamedu, Coimbatore",
    landmark: "Opposite PSG Tech",
    contactName: "Arun Kumar",
    contactPhone: "+91 98430 21765",
  },
  {
    id: "3",
    type: "warehouse",
    name: "Factory / Warehouse",
    address: "Plot 24, SIDCO Industrial Estate, Kurichi, Coimbatore",
    landmark: "Near Pollachi Main Road",
    contactName: "Suresh (Supervisor)",
    contactPhone: "+91 98422 10982",
  },
];

export default function CustomerSavedAddressesModal({
  visible,
  onClose,
  onSelectAddress,
}: Props) {
  const [addresses, setAddresses] = useState<SavedAddress[]>(INITIAL_ADDRESSES);
  const [showAddForm, setShowAddForm] = useState(false);

  // New address state
  const [newType, setNewType] = useState<"home" | "work" | "warehouse">("home");
  const [newName, setNewName] = useState("");
  const [newStreet, setNewStreet] = useState("");
  const [newLandmark, setNewLandmark] = useState("");
  const [newContactName, setNewContactName] = useState("");
  const [newContactPhone, setNewContactPhone] = useState("");

  const handleSaveAddress = () => {
    if (!newStreet.trim() || !newContactName.trim() || !newContactPhone.trim()) {
      Alert.alert("Missing details", "Please fill in address and contact info.");
      return;
    }

    const newAddr: SavedAddress = {
      id: Date.now().toString(),
      type: newType,
      name: newName.trim() || (newType === "home" ? "Home" : newType === "work" ? "Office" : "Warehouse"),
      address: `${newStreet.trim()}, Coimbatore`,
      landmark: newLandmark.trim(),
      contactName: newContactName.trim(),
      contactPhone: newContactPhone.trim(),
    };

    setAddresses([newAddr, ...addresses]);
    setShowAddForm(false);
    // Reset form
    setNewStreet("");
    setNewLandmark("");
    setNewName("");
  };

  const handleDelete = (id: string) => {
    setAddresses(addresses.filter((a) => a.id !== id));
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Pressable onPress={onClose} style={styles.backBtn}>
            <ArrowLeft size={22} color={colors.primaryBlack} />
          </Pressable>
          <Text style={styles.headerTitle}>Saved Addresses</Text>
          <Pressable
            onPress={() => setShowAddForm(true)}
            style={styles.addIconBtn}
          >
            <Plus size={20} color={colors.primaryBlack} />
          </Pressable>
        </View>

        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {showAddForm ? (
            <CarryCard style={styles.formCard}>
              <View style={styles.formCardHeader}>
                <Text style={styles.formCardTitle}>Add New Address</Text>
                <Pressable onPress={() => setShowAddForm(false)}>
                  <X size={20} color={colors.secondaryText} />
                </Pressable>
              </View>

              <View style={styles.typeSelectorRow}>
                {[
                  { type: "home", label: "Home" },
                  { type: "work", label: "Work" },
                  { type: "warehouse", label: "Warehouse" },
                ].map((item) => (
                  <Pressable
                    key={item.type}
                    onPress={() => setNewType(item.type as any)}
                    style={[
                      styles.typeChip,
                      newType === item.type && styles.typeChipActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.typeChipText,
                        newType === item.type && styles.typeChipTextActive,
                      ]}
                    >
                      {item.label}
                    </Text>
                  </Pressable>
                ))}
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>House / Building / Street</Text>
                <TextInput
                  style={styles.inputField}
                  placeholder="e.g. 52 Cross Cut Road"
                  placeholderTextColor={colors.disabledGrey}
                  value={newStreet}
                  onChangeText={setNewStreet}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Landmark (Optional)</Text>
                <TextInput
                  style={styles.inputField}
                  placeholder="e.g. Near Lakshmi Complex"
                  placeholderTextColor={colors.disabledGrey}
                  value={newLandmark}
                  onChangeText={setNewLandmark}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Contact Person</Text>
                <TextInput
                  style={styles.inputField}
                  placeholder="Name"
                  placeholderTextColor={colors.disabledGrey}
                  value={newContactName}
                  onChangeText={setNewContactName}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Contact Number</Text>
                <TextInput
                  style={styles.inputField}
                  placeholder="+91 Mobile number"
                  placeholderTextColor={colors.disabledGrey}
                  keyboardType="phone-pad"
                  value={newContactPhone}
                  onChangeText={setNewContactPhone}
                />
              </View>

              <View style={styles.formButtons}>
                <CarryButton onPress={handleSaveAddress} variant="primary">
                  Save Address
                </CarryButton>
              </View>
            </CarryCard>
          ) : null}

          {/* List of saved addresses */}
          <View style={styles.list}>
            {addresses.map((item) => (
              <CarryCard
                key={item.id}
                onPress={() => {
                  if (onSelectAddress) {
                    onSelectAddress(item.address);
                    onClose();
                  }
                }}
                style={styles.addressCard}
              >
                <View style={styles.addressRow}>
                  <View style={styles.iconBox}>
                    {item.type === "home" ? (
                      <Home size={18} color={colors.primaryBlack} />
                    ) : item.type === "work" ? (
                      <Briefcase size={18} color={colors.primaryBlack} />
                    ) : (
                      <Building size={18} color={colors.primaryBlack} />
                    )}
                  </View>

                  <View style={styles.addressTextCol}>
                    <View style={styles.nameRow}>
                      <Text style={styles.addressName}>{item.name}</Text>
                      <Pressable
                        onPress={() => handleDelete(item.id)}
                        style={styles.deleteBtn}
                      >
                        <Trash2 size={16} color={colors.secondaryText} />
                      </Pressable>
                    </View>
                    <Text style={styles.addressFull}>{item.address}</Text>
                    {item.landmark ? (
                      <Text style={styles.addressLandmark}>
                        Landmark: {item.landmark}
                      </Text>
                    ) : null}
                    <Text style={styles.addressContact}>
                      {item.contactName} • {item.contactPhone}
                    </Text>
                  </View>
                </View>
              </CarryCard>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderGrey,
    backgroundColor: colors.cardSurface,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.lightGrey,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: colors.primaryBlack,
  },
  addIconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.lightGrey,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 36,
  },
  list: {
    gap: 12,
  },
  addressCard: {
    padding: 16,
  },
  addressRow: {
    flexDirection: "row",
    gap: 14,
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.lightGrey,
    alignItems: "center",
    justifyContent: "center",
  },
  addressTextCol: {
    flex: 1,
  },
  nameRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  addressName: {
    fontSize: 16,
    fontWeight: "800",
    color: colors.primaryBlack,
  },
  deleteBtn: {
    padding: 4,
  },
  addressFull: {
    fontSize: 14,
    color: colors.mainText,
    marginTop: 4,
    lineHeight: 20,
  },
  addressLandmark: {
    fontSize: 12,
    color: colors.secondaryText,
    marginTop: 2,
  },
  addressContact: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.secondaryText,
    marginTop: 6,
  },
  formCard: {
    padding: 18,
    marginBottom: 20,
    borderColor: colors.primaryBlack,
  },
  formCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  formCardTitle: {
    fontSize: 17,
    fontWeight: "900",
    color: colors.primaryBlack,
  },
  typeSelectorRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
  },
  typeChip: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 99,
    backgroundColor: colors.lightGrey,
    borderWidth: 1,
    borderColor: colors.borderGrey,
  },
  typeChipActive: {
    backgroundColor: colors.primaryBlack,
    borderColor: colors.primaryBlack,
  },
  typeChipText: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.secondaryText,
  },
  typeChipTextActive: {
    color: colors.white,
  },
  inputGroup: {
    marginBottom: 14,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.secondaryText,
    marginBottom: 6,
  },
  inputField: {
    backgroundColor: colors.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.borderGrey,
    paddingHorizontal: 14,
    height: 48,
    fontSize: 14,
    color: colors.mainText,
  },
  formButtons: {
    marginTop: 10,
  },
});
