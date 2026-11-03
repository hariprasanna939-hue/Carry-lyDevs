export interface OnboardingSlideData {
  step: number;
  title: string;
  description: string;
  type: "vehicles" | "helpers_intro" | "helpers_handled";
}

export const ONBOARDING_SLIDES: OnboardingSlideData[] = [
  {
    step: 1,
    title: "The right vehicle for every load.",
    description:
      "From a single carton to a 3 BHK home — pick Mini, Small, Medium or Large and see the fare before you book.",
    type: "vehicles",
  },
  {
    step: 2,
    title: "Moving help, when you need it.",
    description:
      "Choose loading and unloading helpers and tell us about the floors. We'll help make your move easier.",
    type: "helpers_intro",
  },
  {
    step: 3,
    title: "Helpers, floors, lifts — handled.",
    description:
      "Add up to two loading helpers and tell us about stairs. Follow every step from pickup to drop.",
    type: "helpers_handled",
  },
];

export interface OnboardingVehicleOption {
  id: "mini" | "small" | "medium" | "large";
  name: string;
  capacity: string;
}

export const ONBOARDING_VEHICLES: OnboardingVehicleOption[] = [
  { id: "mini", name: "Mini", capacity: "750 kg" },
  { id: "small", name: "Small", capacity: "1,200 kg" },
  { id: "medium", name: "Medium", capacity: "2,500 kg" },
  { id: "large", name: "Large", capacity: "4,000 kg" },
];
