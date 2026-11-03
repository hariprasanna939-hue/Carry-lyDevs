import { collection, doc, getDoc, getDocs, query, setDoc, where } from "firebase/firestore";
import { db } from "../../services/firebase";
import { PricingRule } from "../../types/pricing-rule";
import { COIMBATORE_VEHICLE_CATEGORIES } from "../../constants/vehicles";
import { APP_CONFIG } from "../../constants/config";

export const pricingRulesService = {
  async getRule(city: string, vehicleType: string): Promise<PricingRule | null> {
    const q = query(
      collection(db, "pricingRules"),
      where("city", "==", city),
      where("vehicleType", "==", vehicleType),
      where("isActive", "==", true)
    );
    const snap = await getDocs(q);
    if (!snap.empty) {
      const docSnap = snap.docs[0];
      return { id: docSnap.id, ...docSnap.data() } as PricingRule;
    }
    return null;
  },

  async seedDefaultCoimbatoreRules(): Promise<void> {
    for (const vehicle of COIMBATORE_VEHICLE_CATEGORIES) {
      const ruleId = `cbe_${vehicle.id}`;
      await setDoc(doc(db, "pricingRules", ruleId), {
        city: "Coimbatore",
        vehicleType: vehicle.id,
        baseFare: Math.round(vehicle.baseFarePaise / 100),
        perKmRate: Math.round(vehicle.perKmRatePaise / 100),
        helperRate: Math.round(APP_CONFIG.helperRatePaise / 100),
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      }, { merge: true });
    }
  },
};
