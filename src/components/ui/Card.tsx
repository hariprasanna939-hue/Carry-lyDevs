import React from "react";
import { StyleSheet, View, ViewProps, ViewStyle } from "react-native";
import { colors } from "../../theme/colors";

export interface CardProps extends ViewProps {
  style?: ViewStyle;
  variant?: "elevated" | "outlined" | "flat";
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  variant = "elevated",
  ...props
}) => {
  return (
    <View
      style={[
        styles.card,
        variant === "elevated" && styles.elevated,
        variant === "outlined" && styles.outlined,
        variant === "flat" && styles.flat,
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
};

export default Card;

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    marginVertical: 6,
  },
  elevated: {
    shadowColor: "#171A2B",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  outlined: {
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  flat: {
    backgroundColor: colors.background,
  },
});
