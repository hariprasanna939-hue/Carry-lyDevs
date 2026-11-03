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
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ArrowLeft,
  Check,
  Clock,
  MapPin,
  Phone,
  Shield,
  Truck,
  X,
} from "lucide-react-native";
import { CarryLogo } from "../../components/CarryLogo";
import { CarryMapPreview } from "../../components/CarryMapPreview";
import { CarryButton, CarryCard, CarryStatusTag } from "../../components/CarryUI";
import { CarryVehicleArt } from "../../components/CarryVehicleArt";
import { colors } from "../../theme/colors";

interface TrackingModalProps {
  visible: boolean;
  onClose: () => void;
  booking: {
    id: string;
    pickup: string;
    drop: string;
    vehicleName: string;
    totalFare: string;
    status: string;
    helperCount: number;
  };
  onCancelBooking?: (bookingId: string) => void;
}

const TIMELINE_STEPS = [
  { key: "confirmed", title: "Booking Confirmed", desc: "Order received & matched" },
  { key: "assigned", title: "Driver Assigned", desc: "Murugan S. with Tata Ace" },
  { key: "reaching_pickup", title: "Driver Reaching Pickup", desc: "1.2 km away (~4 mins)" },
  { key: "arrived", title: "Driver Arrived", desc: "At Gandhipuram Cross Cut Rd" },
  { key: "loading", title: "Loading Goods", desc: "1 Helper assisting with cartons" },
  { key: "in_transit", title: "In Transit to Destination", desc: "Moving via Avinashi Rd" },
  { key: "completed", title: "Move Completed", desc: "Unloaded safely at Peelamedu" },
];

export default function CustomerTrackingModal({
  visible,
  onClose,
  booking,
  onCancelBooking,
}: TrackingModalProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(2); // "Driver Reaching Pickup"
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [selectedCancelReason, setSelectedCancelReason] = useState("");

  const cancelReasons = [
    "Changed moving plans",
    "Driver taking longer than estimated",
    "Selected wrong vehicle size",
    "Booked by mistake",
    "Found alternative transport",
  ];

  const handleConfirmCancel = () => {
    if (!selectedCancelReason) {
      Alert.alert("Reason required", "Please select a cancellation reason.");
      return;
    }
    setShowCancelConfirm(false);
    onCancelBooking?.(booking.id);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={onClose} style={styles.backBtn}>
            <ArrowLeft size={22} color={colors.primaryBlack} />
          </Pressable>
          <View style={styles.headerTitleBox}>
            <Text style={styles.headerTitle}>Live Move Tracking</Text>
            <Text style={styles.headerSub}>ID: {booking.id.slice(0, 10)}</Text>
          </View>
          <Pressable
            onPress={() => Alert.alert("Emergency & Support", "CARRY Coimbatore Helpline: 1800-419-CARRY")}
            style={styles.helpBtn}
          >
            <Shield size={18} color={colors.primaryBlack} />
          </Pressable>
        </View>

        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Monochrome Map Preview */}
          <View style={styles.mapBox}>
            <CarryMapPreview height={180} showRoute />
          </View>

          {/* Assigned Driver Card */}
          <CarryCard style={styles.driverCard}>
            <View style={styles.driverRow}>
              <View style={styles.driverAvatar}>
                <Text style={styles.avatarInitials}>MS</Text>
              </View>
              <View style={styles.driverInfo}>
                <View style={styles.driverNameRow}>
                  <Text style={styles.driverName}>Murugan Selvaraj</Text>
                  <View style={styles.ratingBadge}>
                    <Text style={styles.ratingText}>★ 4.9</Text>
                  </View>
                </View>
                <Text style={styles.vehicleNumber}>
                  {booking.vehicleName} • TN 38 CD 4821
                </Text>
                <Text style={styles.driverTrips}>
                  Verified Partner • 240+ trips in Coimbatore
                </Text>
              </View>
            </View>

            <View style={styles.driverActions}>
              <Pressable
                onPress={() => Alert.alert("Calling Driver", "+91 98431 27560")}
                style={styles.callDriverBtn}
              >
                <Phone size={16} color={colors.white} />
                <Text style={styles.callDriverText}>Call Driver</Text>
              </Pressable>
            </View>
          </CarryCard>

          {/* Location Summary */}
          <CarryCard style={styles.locationCard}>
            <View style={styles.locationRow}>
              <View style={styles.pinDot} />
              <View style={{ flex: 1 }}>
                <Text style={styles.locationLabel}>PICKUP</Text>
                <Text style={styles.locationVal}>{booking.pickup}</Text>
              </View>
            </View>
            <View style={styles.locationDivider} />
            <View style={styles.locationRow}>
              <View style={[styles.pinDot, styles.pinSquare]} />
              <View style={{ flex: 1 }}>
                <Text style={styles.locationLabel}>DROP DESTINATION</Text>
                <Text style={styles.locationVal}>{booking.drop}</Text>
              </View>
            </View>
          </CarryCard>

          {/* Booking Progress Timeline */}
          <CarryCard style={styles.timelineCard}>
            <Text style={styles.timelineTitle}>Move Status Timeline</Text>

            <View style={styles.timelineList}>
              {TIMELINE_STEPS.map((step, idx) => {
                const isCompleted = idx < currentStepIndex;
                const isCurrent = idx === currentStepIndex;
                const isPending = idx > currentStepIndex;

                return (
                  <View key={step.key} style={styles.timelineItem}>
                    <View style={styles.timelineIconCol}>
                      <View
                        style={[
                          styles.timelineCircle,
                          isCompleted && styles.circleCompleted,
                          isCurrent && styles.circleCurrent,
                          isPending && styles.circlePending,
                        ]}
                      >
                        {isCompleted ? (
                          <Check size={11} color={colors.white} strokeWidth={3} />
                        ) : isCurrent ? (
                          <View style={styles.innerDotWhite} />
                        ) : null}
                      </View>
                      {idx < TIMELINE_STEPS.length - 1 && (
                        <View
                          style={[
                            styles.timelineLine,
                            isCompleted ? styles.lineBlack : styles.lineGrey,
                          ]}
                        />
                      )}
                    </View>

                    <View style={styles.timelineContent}>
                      <Text
                        style={[
                          styles.timelineStepTitle,
                          isCurrent && styles.timelineStepTitleActive,
                          isPending && styles.timelineStepTitlePending,
                        ]}
                      >
                        {step.title}
                      </Text>
                      <Text style={styles.timelineStepDesc}>{step.desc}</Text>
                    </View>
                  </View>
                );
              })}
            </View>
          </CarryCard>

          {/* Cancellation Option (if not completed) */}
          {currentStepIndex < 4 && (
            <Pressable
              onPress={() => setShowCancelConfirm(true)}
              style={styles.cancelLink}
            >
              <Text style={styles.cancelLinkText}>Cancel this move</Text>
            </Pressable>
          )}
        </ScrollView>

        {/* Cancellation Reason Modal */}
        <Modal
          visible={showCancelConfirm}
          transparent
          animationType="fade"
          onRequestClose={() => setShowCancelConfirm(false)}
        >
          <View style={styles.modalBackdrop}>
            <View style={styles.cancelSheet}>
              <Text style={styles.cancelSheetTitle}>Cancel Move?</Text>
              <Text style={styles.cancelSheetSub}>
                Select a reason for cancellation. Free cancellation applies within 5 minutes.
              </Text>

              <View style={styles.reasonList}>
                {cancelReasons.map((reason) => {
                  const isSelected = selectedCancelReason === reason;
                  return (
                    <Pressable
                      key={reason}
                      onPress={() => setSelectedCancelReason(reason)}
                      style={[
                        styles.reasonItem,
                        isSelected && styles.reasonItemSelected,
                      ]}
                    >
                      <View
                        style={[
                          styles.radioCircle,
                          isSelected && styles.radioCircleSelected,
                        ]}
                      >
                        {isSelected && <View style={styles.radioDot} />}
                      </View>
                      <Text style={styles.reasonText}>{reason}</Text>
                    </Pressable>
                  );
                })}
              </View>

              <View style={styles.cancelSheetButtons}>
                <CarryButton onPress={handleConfirmCancel} variant="danger">
                  Confirm Cancellation
                </CarryButton>
                <CarryButton
                  onPress={() => setShowCancelConfirm(false)}
                  variant="ghost"
                >
                  Keep Booking
                </CarryButton>
              </View>
            </View>
          </View>
        </Modal>
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
  headerTitleBox: {
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: colors.primaryBlack,
  },
  headerSub: {
    fontSize: 12,
    color: colors.secondaryText,
    fontFamily: "monospace",
  },
  helpBtn: {
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
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 36,
    gap: 16,
  },
  mapBox: {
    borderRadius: 18,
    overflow: "hidden",
  },
  driverCard: {
    padding: 16,
  },
  driverRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  driverAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.primaryBlack,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInitials: {
    fontSize: 18,
    fontWeight: "900",
    color: colors.white,
  },
  driverInfo: {
    flex: 1,
  },
  driverNameRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  driverName: {
    fontSize: 17,
    fontWeight: "800",
    color: colors.primaryBlack,
  },
  ratingBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 99,
    backgroundColor: colors.lightGrey,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: "800",
    color: colors.primaryBlack,
  },
  vehicleNumber: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.mainText,
    marginTop: 2,
  },
  driverTrips: {
    fontSize: 12,
    color: colors.secondaryText,
    marginTop: 2,
  },
  driverActions: {
    marginTop: 14,
    borderTopWidth: 1,
    borderTopColor: colors.borderGrey,
    paddingTop: 12,
  },
  callDriverBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: colors.primaryBlack,
    borderRadius: 14,
    paddingVertical: 12,
  },
  callDriverText: {
    color: colors.white,
    fontWeight: "700",
    fontSize: 14,
  },
  locationCard: {
    padding: 16,
    gap: 10,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  pinDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: colors.primaryBlack,
  },
  pinSquare: {
    borderRadius: 3,
  },
  locationLabel: {
    fontSize: 10,
    fontWeight: "800",
    color: colors.secondaryText,
    letterSpacing: 0.5,
  },
  locationVal: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.mainText,
    marginTop: 2,
  },
  locationDivider: {
    height: 1,
    backgroundColor: colors.borderGrey,
    marginLeft: 26,
  },
  timelineCard: {
    padding: 18,
  },
  timelineTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: colors.primaryBlack,
    marginBottom: 16,
  },
  timelineList: {
    paddingLeft: 4,
  },
  timelineItem: {
    flexDirection: "row",
    minHeight: 52,
  },
  timelineIconCol: {
    alignItems: "center",
    width: 24,
    marginRight: 14,
  },
  timelineCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },
  circleCompleted: {
    backgroundColor: colors.primaryBlack,
  },
  circleCurrent: {
    backgroundColor: colors.primaryBlack,
  },
  circlePending: {
    borderWidth: 1.5,
    borderColor: colors.disabledGrey,
    backgroundColor: colors.cardSurface,
  },
  innerDotWhite: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.white,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    marginVertical: 4,
  },
  lineBlack: {
    backgroundColor: colors.primaryBlack,
  },
  lineGrey: {
    backgroundColor: colors.borderGrey,
  },
  timelineContent: {
    flex: 1,
    paddingBottom: 16,
  },
  timelineStepTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.mainText,
  },
  timelineStepTitleActive: {
    fontSize: 15,
    fontWeight: "900",
    color: colors.primaryBlack,
  },
  timelineStepTitlePending: {
    color: colors.disabledGrey,
  },
  timelineStepDesc: {
    fontSize: 12,
    color: colors.secondaryText,
    marginTop: 2,
  },
  cancelLink: {
    alignItems: "center",
    paddingVertical: 12,
  },
  cancelLinkText: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.secondaryText,
    textDecorationLine: "underline",
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  cancelSheet: {
    backgroundColor: colors.cardSurface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 36,
  },
  cancelSheetTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: colors.primaryBlack,
  },
  cancelSheetSub: {
    fontSize: 14,
    color: colors.secondaryText,
    marginTop: 6,
    marginBottom: 20,
    lineHeight: 20,
  },
  reasonList: {
    gap: 10,
    marginBottom: 24,
  },
  reasonItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 14,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.borderGrey,
  },
  reasonItemSelected: {
    borderColor: colors.primaryBlack,
    backgroundColor: colors.cardSurface,
  },
  radioCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: colors.disabledGrey,
    alignItems: "center",
    justifyContent: "center",
  },
  radioCircleSelected: {
    borderColor: colors.primaryBlack,
  },
  radioDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primaryBlack,
  },
  reasonText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.mainText,
  },
  cancelSheetButtons: {
    gap: 8,
  },
});
