import React, { useState } from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  AlertCircle,
  Bell,
  CheckCircle2,
  Clock,
  CreditCard,
  Package,
  ShieldCheck,
  Truck,
} from "lucide-react-native";
import { CarryCard } from "../../components/CarryUI";
import { colors } from "../../theme/colors";

interface NotificationItem {
  id: string;
  type: "booking" | "driver" | "payment" | "system";
  title: string;
  body: string;
  timestamp: string;
  unread: boolean;
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "1",
    type: "driver",
    title: "Driver is 4 mins away",
    body: "Murugan S. with Mini Truck (Tata Ace) is approaching your Gandhipuram pickup point.",
    timestamp: "10 mins ago",
    unread: true,
  },
  {
    id: "2",
    type: "booking",
    title: "Move Confirmed #CRY-84920",
    body: "Your booking for today at 4:15 PM has been confirmed. 1 loading helper assigned.",
    timestamp: "25 mins ago",
    unread: true,
  },
  {
    id: "3",
    type: "payment",
    title: "Payment Receipt: ₹890",
    body: "Cash payment for your Ganapathy delivery was received successfully.",
    timestamp: "Yesterday",
    unread: false,
  },
  {
    id: "4",
    type: "system",
    title: "New Service Areas in Coimbatore",
    body: "CARRY now offers express mini truck dispatch in Saravanampatti and Thudiyalur.",
    timestamp: "3 days ago",
    unread: false,
  },
];

export default function CustomerNotificationsScreen() {
  const [notifications, setNotifications] = useState<NotificationItem[]>(
    INITIAL_NOTIFICATIONS
  );

  const handleMarkAllRead = () => {
    setNotifications(
      notifications.map((n) => ({
        ...n,
        unread: false,
      }))
    );
  };

  const getIcon = (type: NotificationItem["type"]) => {
    switch (type) {
      case "driver":
        return <Truck size={18} color={colors.primaryBlack} />;
      case "booking":
        return <Package size={18} color={colors.primaryBlack} />;
      case "payment":
        return <CreditCard size={18} color={colors.primaryBlack} />;
      case "system":
      default:
        return <Bell size={18} color={colors.primaryBlack} />;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.pageTitle}>Notifications</Text>
          <Text style={styles.pageSub}>Booking updates and move alerts</Text>
        </View>

        <Pressable onPress={handleMarkAllRead} style={styles.markReadBtn}>
          <Text style={styles.markReadText}>Mark all read</Text>
        </Pressable>
      </View>

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Bell size={28} color={colors.secondaryText} />
            <Text style={styles.emptyTitle}>No notifications yet</Text>
            <Text style={styles.emptySub}>
              We’ll notify you here about your driver status and move updates.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <CarryCard style={[styles.notifCard, item.unread && styles.notifCardUnread]}>
            <View style={styles.notifRow}>
              <View style={styles.iconCircle}>{getIcon(item.type)}</View>

              <View style={styles.contentCol}>
                <View style={styles.titleRow}>
                  <Text style={styles.notifTitle}>{item.title}</Text>
                  {item.unread && <View style={styles.unreadDot} />}
                </View>
                <Text style={styles.notifBody}>{item.body}</Text>
                <Text style={styles.notifTime}>{item.timestamp}</Text>
              </View>
            </View>
          </CarryCard>
        )}
      />
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
    alignItems: "flex-end",
    justifyContent: "space-between",
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
  pageSub: {
    fontSize: 13,
    color: colors.secondaryText,
    marginTop: 2,
  },
  markReadBtn: {
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  markReadText: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.primaryBlack,
    textDecorationLine: "underline",
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 36,
    gap: 12,
  },
  notifCard: {
    padding: 16,
  },
  notifCardUnread: {
    borderColor: colors.primaryBlack,
    borderWidth: 1.5,
  },
  notifRow: {
    flexDirection: "row",
    gap: 14,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.lightGrey,
    alignItems: "center",
    justifyContent: "center",
  },
  contentCol: {
    flex: 1,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  notifTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: colors.primaryBlack,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primaryBlack,
  },
  notifBody: {
    fontSize: 13,
    color: colors.mainText,
    lineHeight: 18,
    marginTop: 4,
  },
  notifTime: {
    fontSize: 11,
    fontWeight: "600",
    color: colors.secondaryText,
    marginTop: 6,
  },
  emptyBox: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    gap: 12,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: colors.primaryBlack,
  },
  emptySub: {
    fontSize: 13,
    color: colors.secondaryText,
    textAlign: "center",
    maxWidth: 240,
  },
});
