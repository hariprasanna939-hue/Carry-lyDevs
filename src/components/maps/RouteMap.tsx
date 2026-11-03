import React from "react";
import { StyleSheet, Text, View, ViewStyle } from "react-native";
import { colors } from "../../theme/colors";
import { LocationPoint } from "../../types/booking";

export interface RouteMapProps {
  pickup?: LocationPoint | null;
  dropoff?: LocationPoint | null;
  driverLocation?: { latitude: number; longitude: number } | null;
  style?: ViewStyle;
}

export const RouteMap: React.FC<RouteMapProps> = ({
  pickup,
  dropoff,
  driverLocation,
  style,
}) => {
  return (
    <View style={[styles.mapContainer, style]}>
      <View style={styles.gridOverlay}>
        <Text style={styles.mapPin}>📍</Text>
        <Text style={styles.mapText}>Interactive Route Map</Text>
        {pickup ? (
          <Text style={styles.subText} numberOfLines={1}>
            Pickup: {pickup.address}
          </Text>
        ) : null}
        {dropoff ? (
          <Text style={styles.subText} numberOfLines={1}>
            Dropoff: {dropoff.address}
          </Text>
        ) : null}
        {driverLocation ? (
          <Text style={styles.driverTag}>🚚 Driver nearby</Text>
        ) : null}
      </View>
    </View>
  );
};

export default RouteMap;

const styles = StyleSheet.create({
  mapContainer: {
    height: 200,
    backgroundColor: "#E4E9F2",
    borderRadius: 16,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  gridOverlay: {
    alignItems: "center",
    padding: 16,
  },
  mapPin: {
    fontSize: 32,
    marginBottom: 6,
  },
  mapText: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.deepNavy,
  },
  subText: {
    fontSize: 12,
    color: colors.secondaryText,
    marginTop: 4,
    textAlign: "center",
    maxWidth: 260,
  },
  driverTag: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: "700",
    color: colors.primary,
    backgroundColor: colors.customerTint,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
});
