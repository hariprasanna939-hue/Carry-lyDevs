import { db } from '../../config/firebase';
import { COLLECTIONS } from '../../config/collections';

export class PricingRepository {
  public static async getDynamicConfig(city = 'Coimbatore'): Promise<Record<string, unknown> | null> {
    const doc = await db.collection(COLLECTIONS.PRICING_CONFIGS).doc(city.toLowerCase()).get();
    return doc.exists ? (doc.data() as Record<string, unknown>) : null;
  }
}
