import { db } from '../../config/firebase';
import { COLLECTIONS } from '../../config/collections';
import { AdminAuditLogger } from './admin.audit';
import { getIsoTimestamp } from '../../common/utils/timestamps';

export class AdminPricingManagement {
  public static async updateCityPricing(adminId: string, city: string, pricingData: Record<string, unknown>) {
    const cityKey = city.toLowerCase();
    await db.collection(COLLECTIONS.PRICING_CONFIGS).doc(cityKey).set(
      {
        ...pricingData,
        updatedAt: getIsoTimestamp(),
        updatedBy: adminId,
      },
      { merge: true }
    );

    await AdminAuditLogger.logAction(adminId, 'UPDATE_PRICING', 'pricing', cityKey, pricingData);
    return { city, success: true };
  }
}
