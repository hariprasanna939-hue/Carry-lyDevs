import React from "react";
import { Stack } from "expo-router";
import { colors } from "../../src/theme/colors";

export default function CustomerLayout() {
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
      <Stack.Screen name="index" options={{ title: "CARRY Logistics", headerShown: false }} />
      <Stack.Screen name="booking/location" options={{ title: "Select Locations" }} />
      <Stack.Screen name="booking/vehicle" options={{ title: "Choose Vehicle" }} />
      <Stack.Screen name="booking/items" options={{ title: "Goods Details" }} />
      <Stack.Screen name="booking/helpers" options={{ title: "Loading Helpers" }} />
      <Stack.Screen name="booking/schedule" options={{ title: "Schedule Pickup" }} />
      <Stack.Screen name="booking/fare" options={{ title: "Review Fare" }} />
      <Stack.Screen name="booking/confirmation" options={{ title: "Booking Placed", headerShown: false }} />
      <Stack.Screen name="bookings/index" options={{ title: "My Bookings" }} />
      <Stack.Screen name="bookings/[bookingId]" options={{ title: "Trip Details" }} />
      <Stack.Screen name="tracking/[bookingId]" options={{ title: "Live Tracking" }} />
      <Stack.Screen name="payments/[bookingId]" options={{ title: "Payment" }} />
      <Stack.Screen name="history" options={{ title: "Order History" }} />
      <Stack.Screen name="addresses" options={{ title: "Saved Addresses" }} />
      <Stack.Screen name="reviews" options={{ title: "Trip Reviews" }} />
      <Stack.Screen name="profile" options={{ title: "My Profile" }} />
    </Stack>
  );
}
