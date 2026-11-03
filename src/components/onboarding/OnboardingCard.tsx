import React, { ReactNode } from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import { colors } from "../../theme/colors";

interface Props {
  children: ReactNode;
  style?: ViewStyle;
  selected?: boolean;
}

export function OnboardingCard({ children, style, selected }: Props) {
  return (
    <View
      style={[
        styles.card,
        selected ? styles.cardSelected : styles.cardDefault,
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.cardSurface,
    borderRadius: 18,
    padding: 16,
  },
  cardDefault: {
    borderWidth: 1,
    borderColor: colors.borderGrey,
  },
  cardSelected: {
    borderWidth: 2,
    borderColor: colors.primaryBlack,
  },
});
