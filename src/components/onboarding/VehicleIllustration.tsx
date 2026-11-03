import React from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import { CarryVehicleArt, VehicleArtType } from "../CarryVehicleArt";

interface Props {
  type: VehicleArtType;
  width?: number;
  style?: ViewStyle;
}

export function VehicleIllustration({ type, width = 110, style }: Props) {
  return (
    <View style={[styles.container, style]}>
      <CarryVehicleArt type={type} width={width} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
});
