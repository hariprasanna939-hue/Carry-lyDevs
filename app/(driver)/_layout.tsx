import React from "react";
import { Stack } from "expo-router";
import { colors } from "../../src/theme/colors";

export default function DriverLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.surface,
        },
        headerTintColor: colors.deepNavy,
        headerTitleStyle: {
          fontWeight: "700",
        },
        contentStyle: {
          backgroundColor: colors.background,
        },
      }}
    >
      <Stack.Screen name="index" options={{ title: "Driver Partner", headerShown: false }} />
      <Stack.Screen name="registration/index" options={{ title: "Become a Partner", headerShown: false }} />
      <Stack.Screen name="registration/onboarding" options={{ title: "Partner Registration", headerShown: false }} />
      <Stack.Screen name="registration/personal" options={{ title: "Driver Details" }} />
      <Stack.Screen name="registration/vehicle" options={{ title: "Vehicle Registration" }} />
      <Stack.Screen name="registration/documents" options={{ title: "KYC Documents" }} />
      <Stack.Screen name="registration/status" options={{ title: "Verification Status" }} />
      <Stack.Screen name="jobs/index" options={{ title: "Available Jobs" }} />
      <Stack.Screen name="jobs/[bookingId]" options={{ title: "Trip Request" }} />
      <Stack.Screen name="active-trip/[bookingId]" options={{ title: "Live Trip", headerShown: false }} />
      <Stack.Screen name="navigation" options={{ title: "Trip Navigation" }} />
      <Stack.Screen name="earnings" options={{ title: "Earnings & Payouts" }} />
      <Stack.Screen name="trip-history" options={{ title: "Completed Trips" }} />
      <Stack.Screen name="profile" options={{ title: "Driver Profile" }} />
    </Stack>
  );
}
