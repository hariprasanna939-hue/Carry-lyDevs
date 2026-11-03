import AsyncStorage from "@react-native-async-storage/async-storage";

export const ONBOARDING_COMPLETED_KEY = "@carry_onboarding_completed";

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
