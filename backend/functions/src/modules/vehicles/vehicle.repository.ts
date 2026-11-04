import { db } from '../../config/firebase';
import { COLLECTIONS } from '../../config/collections';
import { VehicleRecord } from './vehicle.types';

export class VehicleRepository {
  public static async getById(id: string): Promise<VehicleRecord | null> {
    const doc = await db.collection(COLLECTIONS.VEHICLES).doc(id).get();
    return doc.exists ? (doc.data() as VehicleRecord) : null;
  }

  public static async getByDriverId(driverId: string): Promise<VehicleRecord[]> {
    const snap = await db.collection(COLLECTIONS.VEHICLES).where('driverId', '==', driverId).get();
    return snap.docs.map((doc) => doc.data() as VehicleRecord);
  }

  public static async save(vehicle: VehicleRecord): Promise<void> {
    await db.collection(COLLECTIONS.VEHICLES).doc(vehicle.id).set(vehicle, { merge: true });
  }
}
