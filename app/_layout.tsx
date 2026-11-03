import React from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { AuthProvider } from "../src/auth/AuthContext";
import { colors } from "../src/theme/colors";

export default function RootLayout() {
  return (
    <AuthProvider>
      <StatusBar style="dark" />
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
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding/index" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding/permissions" options={{ title: "Permissions" }} />
        <Stack.Screen name="(auth)/login" options={{ title: "Sign In", headerShown: false }} />
        <Stack.Screen name="(auth)/register" options={{ title: "Create Account", headerShown: false }} />
        <Stack.Screen name="(auth)/forgot-password" options={{ title: "Reset Password" }} />
        <Stack.Screen name="(auth)/choose-portal" options={{ title: "Select Portal" }} />
        <Stack.Screen name="(customer)" options={{ headerShown: false }} />
        <Stack.Screen name="(driver)" options={{ headerShown: false }} />
        <Stack.Screen name="(shared)/notifications" options={{ title: "Notifications" }} />
        <Stack.Screen name="(shared)/support" options={{ title: "Help & Support" }} />
        <Stack.Screen name="(shared)/settings" options={{ title: "Settings" }} />
        <Stack.Screen name="(shared)/terms" options={{ title: "Terms & Conditions" }} />
        <Stack.Screen name="+not-found" options={{ title: "Oops!" }} />
      </Stack>
    </AuthProvider>
  );
}
