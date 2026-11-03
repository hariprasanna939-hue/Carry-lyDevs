"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateFareInternal = calculateFareInternal;
const config_1 = require("../../config");
// Fallback rates if city rule is not yet in database
const DEFAULT_RATES = {
    "3_wheeler_cargo": { baseFare: 250, perKmRate: 22, helperRate: 150 },
    "tata_ace": { baseFare: 350, perKmRate: 28, helperRate: 150 },
    "pickup_truck": { baseFare: 550, perKmRate: 35, helperRate: 150 },
    "large_commercial": { baseFare: 850, perKmRate: 48, helperRate: 200 },
};
async function calculateFareInternal({ city = "Coimbatore", vehicleType, distanceKm, helperCount = 0, }) {
    let baseFare = 350;
    let perKmRate = 28;
    let helperRate = 150;
    // 1. Fetch live pricing rule from Firestore
    try {
        const rulesSnap = await config_1.db
            .collection("pricingRules")
            .where("city", "==", city)
            .where("vehicleType", "==", vehicleType)
            .where("isActive", "==", true)
            .limit(1)
            .get();
        if (!rulesSnap.empty) {
            const data = rulesSnap.docs[0].data();
            baseFare = Number(data.baseFare) || baseFare;
            perKmRate = Number(data.perKmRate) || perKmRate;
            helperRate = Number(data.helperRate) || helperRate;
        }
        else if (DEFAULT_RATES[vehicleType]) {
            const fallback = DEFAULT_RATES[vehicleType];
            baseFare = fallback.baseFare;
            perKmRate = fallback.perKmRate;
            helperRate = fallback.helperRate;
        }
    }
    catch (err) {
        // If DB read fails, use fallback
        if (DEFAULT_RATES[vehicleType]) {
            const fallback = DEFAULT_RATES[vehicleType];
            baseFare = fallback.baseFare;
            perKmRate = fallback.perKmRate;
            helperRate = fallback.helperRate;
        }
    }
    const baseFarePaise = baseFare * 100;
    const perKmRatePaise = perKmRate * 100;
    const helperRatePaise = helperRate * 100;
    const distanceFarePaise = Math.round(distanceKm * perKmRatePaise);
    const helperFarePaise = helperCount * helperRatePaise;
    const tollFarePaise = 0;
    const totalFarePaise = Math.max(baseFarePaise, baseFarePaise + distanceFarePaise + helperFarePaise + tollFarePaise);
    const totalFare = Math.round(totalFarePaise / 100);
    return {
        city,
        vehicleType,
        distanceKm,
        helperCount,
        fareBreakdown: {
            baseFarePaise,
            distanceFarePaise,
            helperFarePaise,
            tollFarePaise,
            totalFarePaise,
        },
        totalFare,
    };
}
//# sourceMappingURL=index.js.map