import React from "react";
import { MainNavigator } from "../App";

/**
 * Entry screen for CARRY mobile application via Expo Router.
 * Renders the introductory flow:
 * 1. Splash Screen
 * 2. Welcome Screen
 * 3. Onboarding Screen 1 (Vehicle Selection)
 * 4. Onboarding Screen 2 (Helpers & Floor Support)
 * 5. Onboarding Screen 3 (Moving Made Easy / Handled)
 * 6. Choose Your Role Screen (Customer vs Driver)
 * 7. Role-specific Login & Registration
 * 8. Correct Portal Dashboard (Customer or Driver)
 */
export default function IndexScreen() {
  return <MainNavigator />;
}
