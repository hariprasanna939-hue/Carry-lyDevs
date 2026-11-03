import React, { useState } from "react";
import {
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
  Building,
  Check,
  ChevronDown,
  Info,
  Package,
  Truck,
  UsersRound,
} from "lucide-react-native";
import { CarryButton, CarryCard } from "../../components/CarryUI";
import { colors } from "../../theme/colors";

export interface BookingDetailsData {
  category: string;
  pickupFloor: number;
  pickupLift: boolean;
  dropFloor: number;
  dropLift: boolean;
  helpers: 0 | 1 | 2;
  instructions: string;
}

interface Props {
  visible: boolean;
  onClose: () => void;
  onProceed: (data: BookingDetailsData) => void;
  initialData?: Partial<BookingDetailsData>;
}

const GOODS_CATEGORIES = [
  "Furniture & Home",
  "Cartons & Moving",
  "Electronics & Appliances",
  "Hardware & Commercial",
  "Industrial Goods",
];

export default function CustomerBookingDetailsModal({
  visible,
  onClose,
  onProceed,
  initialData,
}: Props) {
  const [category, setCategory] = useState(
    initialData?.category || GOODS_CATEGORIES[0]
  );
  const [pickupFloor, setPickupFloor] = useState(initialData?.pickupFloor || 0);
  const [pickupLift, setPickupLift] = useState(initialData?.pickupLift ?? true);
  const [dropFloor, setDropFloor] = useState(initialData?.dropFloor || 0);
  const [dropLift, setDropLift] = useState(initialData?.dropLift ?? true);
  const [helpers, setHelpers] = useState<0 | 1 | 2>(initialData?.helpers ?? 1);
  const [instructions, setInstructions] = useState(
    initialData?.instructions || ""
  );

  const handleDone = () => {
    onProceed({
      category,
      pickupFloor,
      pickupLift,
      dropFloor,
      dropLift,
      helpers,
      instructions,
    });
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Pressable onPress={onClose} style={styles.backBtn}>
            <ArrowLeft size={22} color={colors.primaryBlack} />
          </Pressable>
          <Text style={styles.headerTitle}>Move & Goods Details</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Goods Category */}
          <Text style={styles.sectionHeading}>What are you moving?</Text>
          <View style={styles.categoriesRow}>
            {GOODS_CATEGORIES.map((cat) => {
              const active = category === cat;
              return (
                <Pressable
                  key={cat}
                  onPress={() => setCategory(cat)}
                  style={[
                    styles.categoryChip,
                    active && styles.categoryChipActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.categoryChipText,
                      active && styles.categoryChipTextActive,
                    ]}
                  >
                    {cat}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {/* Helpers Selection */}
          <Text style={styles.sectionHeading}>Loading & Unloading Helpers</Text>
          <View style={styles.helpersGrid}>
            {[
              { count: 0, label: "Driver Only", fee: "Free", desc: "You handle loading" },
              { count: 1, label: "+1 Helper", fee: "+₹250", desc: "Driver + 1 mover" },
              { count: 2, label: "+2 Helpers", fee: "+₹450", desc: "Full loading team" },
            ].map((opt) => {
              const active = helpers === opt.count;
              return (
                <CarryCard
                  key={opt.count}
                  onPress={() => setHelpers(opt.count as any)}
                  style={[
                    styles.helperCard,
                    active && styles.helperCardActive,
                  ]}
                >
                  <View style={styles.helperHeader}>
                    <Text
                      style={[
                        styles.helperLabel,
                        active && styles.helperLabelActive,
                      ]}
                    >
                      {opt.label}
                    </Text>
                    <Text
                      style={[
                        styles.helperFee,
                        active && styles.helperFeeActive,
                      ]}
                    >
                      {opt.fee}
                    </Text>
                  </View>
                  <Text
                    style={[
                      styles.helperDesc,
                      active && styles.helperDescActive,
                    ]}
                  >
                    {opt.desc}
                  </Text>
                </CarryCard>
              );
            })}
          </View>

          {/* Floor & Lift Details */}
          <Text style={styles.sectionHeading}>Floors & Elevator Access</Text>

          {/* Pickup Floor */}
          <CarryCard style={styles.floorCard}>
            <Text style={styles.floorCardTitle}>Pickup Location</Text>
            <View style={styles.floorRow}>
              <Text style={styles.floorLabel}>Floor Number</Text>
              <View style={styles.floorChipsRow}>
                {[0, 1, 2, 3].map((fl) => (
                  <Pressable
                    key={fl}
                    onPress={() => setPickupFloor(fl)}
                    style={[
                      styles.floorChip,
                      pickupFloor === fl && styles.floorChipActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.floorChipText,
                        pickupFloor === fl && styles.floorChipTextActive,
                      ]}
                    >
                      {fl === 0 ? "Ground" : `${fl}F`}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            <View style={styles.liftRow}>
              <Text style={styles.floorLabel}>Service Lift Available?</Text>
              <View style={styles.liftToggleRow}>
                <Pressable
                  onPress={() => setPickupLift(true)}
                  style={[
                    styles.liftBtn,
                    pickupLift && styles.liftBtnActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.liftBtnText,
                      pickupLift && styles.liftBtnTextActive,
                    ]}
                  >
                    Yes
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => setPickupLift(false)}
                  style={[
                    styles.liftBtn,
                    !pickupLift && styles.liftBtnActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.liftBtnText,
                      !pickupLift && styles.liftBtnTextActive,
                    ]}
                  >
                    No
                  </Text>
                </Pressable>
              </View>
            </View>
          </CarryCard>

          {/* Drop Floor */}
          <CarryCard style={styles.floorCard}>
            <Text style={styles.floorCardTitle}>Drop Destination</Text>
            <View style={styles.floorRow}>
              <Text style={styles.floorLabel}>Floor Number</Text>
              <View style={styles.floorChipsRow}>
                {[0, 1, 2, 3].map((fl) => (
                  <Pressable
                    key={fl}
                    onPress={() => setDropFloor(fl)}
                    style={[
                      styles.floorChip,
                      dropFloor === fl && styles.floorChipActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.floorChipText,
                        dropFloor === fl && styles.floorChipTextActive,
                      ]}
                    >
                      {fl === 0 ? "Ground" : `${fl}F`}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            <View style={styles.liftRow}>
              <Text style={styles.floorLabel}>Service Lift Available?</Text>
              <View style={styles.liftToggleRow}>
                <Pressable
                  onPress={() => setDropLift(true)}
                  style={[
                    styles.liftBtn,
                    dropLift && styles.liftBtnActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.liftBtnText,
                      dropLift && styles.liftBtnTextActive,
                    ]}
                  >
                    Yes
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => setDropLift(false)}
                  style={[
                    styles.liftBtn,
                    !dropLift && styles.liftBtnActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.liftBtnText,
                      !dropLift && styles.liftBtnTextActive,
                    ]}
                  >
                    No
                  </Text>
                </Pressable>
              </View>
            </View>
          </CarryCard>

          {/* Special Instructions */}
          <Text style={styles.sectionHeading}>Instructions for Driver</Text>
          <CarryCard style={styles.instructionsCard}>
            <TextInput
              style={styles.instructionsInput}
              placeholder="e.g. Handle dining table with care, call when entering gate"
              placeholderTextColor={colors.disabledGrey}
              multiline
              value={instructions}
              onChangeText={setInstructions}
            />
          </CarryCard>
        </ScrollView>

        <View style={styles.bottomBar}>
          <CarryButton onPress={handleDone} variant="primary">
            Save Details
          </CarryButton>
        </View>
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
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 36,
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: "800",
    color: colors.primaryBlack,
    marginTop: 6,
    marginBottom: 12,
    letterSpacing: -0.3,
  },
  categoriesRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 20,
  },
  categoryChip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 99,
    backgroundColor: colors.cardSurface,
    borderWidth: 1,
    borderColor: colors.borderGrey,
  },
  categoryChipActive: {
    backgroundColor: colors.primaryBlack,
    borderColor: colors.primaryBlack,
  },
  categoryChipText: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.mainText,
  },
  categoryChipTextActive: {
    color: colors.white,
  },
  helpersGrid: {
    gap: 10,
    marginBottom: 24,
  },
  helperCard: {
    padding: 14,
    borderWidth: 1.5,
    borderColor: colors.borderGrey,
  },
  helperCardActive: {
    borderColor: colors.primaryBlack,
    backgroundColor: colors.cardSurface,
  },
  helperHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  helperLabel: {
    fontSize: 15,
    fontWeight: "800",
    color: colors.primaryBlack,
  },
  helperLabelActive: {
    color: colors.primaryBlack,
  },
  helperFee: {
    fontSize: 14,
    fontWeight: "900",
    color: colors.primaryBlack,
  },
  helperFeeActive: {
    color: colors.primaryBlack,
  },
  helperDesc: {
    fontSize: 12,
    color: colors.secondaryText,
    marginTop: 3,
  },
  helperDescActive: {
    color: colors.secondaryText,
  },
  floorCard: {
    padding: 16,
    marginBottom: 14,
    gap: 14,
  },
  floorCardTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: colors.primaryBlack,
  },
  floorRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  floorLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.secondaryText,
  },
  floorChipsRow: {
    flexDirection: "row",
    gap: 6,
  },
  floorChip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: colors.lightGrey,
  },
  floorChipActive: {
    backgroundColor: colors.primaryBlack,
  },
  floorChipText: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.mainText,
  },
  floorChipTextActive: {
    color: colors.white,
  },
  liftRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: colors.borderGrey,
    paddingTop: 12,
  },
  liftToggleRow: {
    flexDirection: "row",
    gap: 6,
  },
  liftBtn: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 8,
    backgroundColor: colors.lightGrey,
  },
  liftBtnActive: {
    backgroundColor: colors.primaryBlack,
  },
  liftBtnText: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.mainText,
  },
  liftBtnTextActive: {
    color: colors.white,
  },
  instructionsCard: {
    padding: 12,
    marginBottom: 20,
  },
  instructionsInput: {
    height: 70,
    fontSize: 14,
    color: colors.mainText,
    textAlignVertical: "top",
  },
  bottomBar: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: colors.borderGrey,
    backgroundColor: colors.cardSurface,
  },
});
