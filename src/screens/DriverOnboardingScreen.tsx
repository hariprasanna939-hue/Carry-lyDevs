import React from "react";
import DriverOnboardingWizard, {
  DriverOnboardingWizardProps,
} from "../../app/(driver)/registration/onboarding";

export type { DriverOnboardingWizardProps };

/**
 * Driver Onboarding Screen
 * 12-Step comprehensive onboarding wizard for CARRY Driver Partners.
 * Saves progress per step to Firestore `driverApplications/{uid}`.
 */
export default function DriverOnboardingScreen(props: DriverOnboardingWizardProps) {
  return <DriverOnboardingWizard {...props} />;
}
