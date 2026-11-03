import React from "react";
import { ActivityIndicator, StyleSheet, Text, View, ViewStyle } from "react-native";
import { colors } from "../../theme/colors";

export interface LoaderProps {
  message?: string;
  size?: "small" | "large";
  color?: string;
  style?: ViewStyle;
}

export const Loader: React.FC<LoaderProps> = ({
  message = "Loading...",
  size = "large",
  color = colors.primary,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <ActivityIndicator size={size} color={color} />
      {message ? <Text style={styles.text}>{message}</Text> : null}
    </View>
  );
};

export default Loader;

const styles = StyleSheet.create({
  container: {
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    marginTop: 12,
    fontSize: 14,
    color: colors.secondaryText,
    fontWeight: "500",
  },
});
