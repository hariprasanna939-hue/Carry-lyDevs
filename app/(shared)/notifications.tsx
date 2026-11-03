import React from "react";
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { colors } from "../../src/theme/colors";

const NOTIFICATIONS = [
  {
    id: "1",
    title: "Welcome to CARRY!",
    message: "Book 3-wheelers and mini-trucks for all your cargo needs in Coimbatore.",
    time: "Just now",
  },
  {
    id: "2",
    title: "Discount on First Booking",
    message: "Use code FIRSTTRIP to get ₹50 off your first delivery.",
    time: "2 hours ago",
  },
];

export default function NotificationsScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={NOTIFICATIONS}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.message}>{item.message}</Text>
            <Text style={styles.time}>{item.time}</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  list: {
    padding: 20,
  },
  card: {
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: colors.border,
    marginBottom: 10,
  },
  title: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.deepNavy,
  },
  message: {
    fontSize: 13,
    color: colors.secondaryText,
    marginTop: 4,
    lineHeight: 18,
  },
  time: {
    fontSize: 11,
    color: colors.secondaryText,
    marginTop: 8,
  },
});
