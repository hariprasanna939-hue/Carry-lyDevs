import React, { useState } from "react";
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { colors } from "../../src/theme/colors";
import Button from "../../src/components/ui/Button";

interface SavedAddress {
  id: string;
  tag: string;
  address: string;
  landmark: string;
}

const DEFAULT_ADDRESSES: SavedAddress[] = [
  {
    id: "1",
    tag: "Warehouse / Factory",
    address: "SF 242, SIDCO Industrial Estate, Kurichi, Coimbatore",
    landmark: "Near Toll Gate",
  },
  {
    id: "2",
    tag: "Office / Store",
    address: "84 Cross Cut Road, Gandhipuram, Coimbatore",
    landmark: "Opposite City Bank",
  },
  {
    id: "3",
    tag: "Residence",
    address: "Flat 4B, Green Meadows, Vadavalli, Coimbatore",
    landmark: "Near Bus Terminus",
  },
];

export default function CustomerAddressesScreen() {
  const [addresses] = useState<SavedAddress[]>(DEFAULT_ADDRESSES);

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={addresses}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListFooterComponent={
          <Button
            title="+ Add New Address"
            variant="outline"
            style={{ marginTop: 12 }}
            onPress={() => {}}
          />
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.badge}>
              <Text style={styles.tagText}>{item.tag}</Text>
            </View>
            <Text style={styles.addressText}>{item.address}</Text>
            <Text style={styles.landmarkText}>Landmark: {item.landmark}</Text>
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
    flexGrow: 1,
  },
  card: {
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: colors.border,
    marginBottom: 12,
  },
  badge: {
    backgroundColor: colors.customerTint,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: "flex-start",
    marginBottom: 8,
  },
  tagText: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.primary,
  },
  addressText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.deepNavy,
    marginBottom: 4,
  },
  landmarkText: {
    fontSize: 12,
    color: colors.secondaryText,
  },
});
