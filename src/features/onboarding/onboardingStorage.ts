import AsyncStorage from "@react-native-async-storage/async-storage";

export const ONBOARDING_COMPLETED_KEY = "@carry_onboarding_completed";
export const SELECTED_ROLE_KEY = "@carry_selected_role";

/**
 * Checks whether the user has previously completed or skipped the onboarding flow.
 */
export async function isOnboardingCompleted(): Promise<boolean> {
  try {
    const value = await AsyncStorage.getItem(ONBOARDING_COMPLETED_KEY);
    return value === "true";
  } catch (error) {
    console.warn("Failed to read onboarding state from AsyncStorage:", error);
    return false;
  }
}

/**
 * Marks onboarding as completed in AsyncStorage so it won't be shown again.
 */
export async function completeOnboarding(): Promise<void> {
  try {
    await AsyncStorage.setItem(ONBOARDING_COMPLETED_KEY, "true");
  } catch (error) {
    console.warn("Failed to persist onboarding completion state:", error);
  }
}

/**
 * Resets the onboarding state (useful for testing or profile reset).
 */
export async function clearOnboarding(): Promise<void> {
  try {
    await AsyncStorage.removeItem(ONBOARDING_COMPLETED_KEY);
  } catch (error) {
    console.warn("Failed to clear onboarding state:", error);
  }
}

/**
 * Retrieves the user's previously selected role preference from AsyncStorage.
 */
export async function getSelectedRole(): Promise<"customer" | "driver" | null> {
  try {
    const val = await AsyncStorage.getItem(SELECTED_ROLE_KEY);
    if (val === "customer" || val === "driver") {
      return val;
    }
    return null;
  } catch (error) {
    console.warn("Failed to read selected role from AsyncStorage:", error);
    return null;
  }
}

/**
 * Persists the user's selected role preference to AsyncStorage.
 */
export async function setSelectedRole(role: "customer" | "driver"): Promise<void> {
  try {
    await AsyncStorage.setItem(SELECTED_ROLE_KEY, role);
  } catch (error) {
    console.warn("Failed to save selected role to AsyncStorage:", error);
  }
}

/**
 * Clears the selected role preference from AsyncStorage.
 */
export async function clearSelectedRole(): Promise<void> {
  try {
    await AsyncStorage.removeItem(SELECTED_ROLE_KEY);
  } catch (error) {
    console.warn("Failed to clear selected role from AsyncStorage:", error);
  }
}
