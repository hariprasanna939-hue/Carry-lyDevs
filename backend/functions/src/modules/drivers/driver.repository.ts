import { db } from '../../config/firebase';
import { COLLECTIONS } from '../../config/collections';
import { DriverProfile } from './driver.types';

export class DriverRepository {
  public static async getById(driverId: string): Promise<DriverProfile | null> {
    // 1. Try drivers/{uid}
    const doc = await db.collection(COLLECTIONS.DRIVERS).doc(driverId).get();
    if (doc.exists) {
      const data = doc.data() as Record<string, unknown>;
      return {
        userId: driverId,
        fullName: (data.fullName as string) || 'Driver',
        phone: (data.phone as string) || '',
        email: (data.email as string) || '',
        verificationStatus: (data.verificationStatus as DriverProfile['verificationStatus']) || 'pending',
        onlineStatus: Boolean(data.isAvailable ?? data.onlineStatus),
        serviceAreas: (data.serviceAreas as string[]) || ['Coimbatore'],
        activeVehicleId: (data.activeVehicleId as string) || undefined,
        rating: typeof data.rating === 'number' ? data.rating : 5.0,
        totalTrips: typeof data.completedTrips === 'number' ? data.completedTrips : (data.totalTrips as number) || 0,
        totalEarnings: (data.totalEarnings as number) || 0,
        currentLocation: data.currentLocation as DriverProfile['currentLocation'],
        createdAt: (data.createdAt as string) || new Date().toISOString(),
        updatedAt: (data.updatedAt as string) || new Date().toISOString(),
      };
    }

    // 2. Fallback to driverProfiles/{uid}
    const legacyDoc = await db.collection('driverProfiles').doc(driverId).get();
    return legacyDoc.exists ? (legacyDoc.data() as DriverProfile) : null;
  }

  public static async save(profile: DriverProfile): Promise<void> {
    const driverDoc = {
      userId: profile.userId,
      fullName: profile.fullName,
      phone: profile.phone,
      email: profile.email,
      verificationStatus: profile.verificationStatus,
      isAvailable: profile.onlineStatus,
      onlineStatus: profile.onlineStatus,
      serviceAreas: profile.serviceAreas,
      activeVehicleId: profile.activeVehicleId,
      rating: profile.rating,
      completedTrips: profile.totalTrips,
      totalTrips: profile.totalTrips,
      totalEarnings: profile.totalEarnings,
      currentLocation: profile.currentLocation,
      updatedAt: profile.updatedAt,
      createdAt: profile.createdAt,
    };

    // Save to primary collection `drivers/{uid}`
    await db.collection(COLLECTIONS.DRIVERS).doc(profile.userId).set(driverDoc, { merge: true });
    // Also mirror to `driverProfiles/{uid}` for backward compatibility
    await db.collection('driverProfiles').doc(profile.userId).set(profile, { merge: true });
  }

  public static async update(driverId: string, updates: Partial<DriverProfile>): Promise<void> {
    const sanitized: Record<string, unknown> = { ...updates };
    if (updates.onlineStatus !== undefined) {
      sanitized.isAvailable = updates.onlineStatus;
    }
    if (updates.totalTrips !== undefined) {
      sanitized.completedTrips = updates.totalTrips;
    }

    await db.collection(COLLECTIONS.DRIVERS).doc(driverId).set(sanitized, { merge: true });
    await db.collection('driverProfiles').doc(driverId).set(updates, { merge: true });
  }

  public static async getActiveOnlineDrivers(): Promise<DriverProfile[]> {
    const snap = await db
      .collection(COLLECTIONS.DRIVERS)
      .where('verificationStatus', '==', 'approved')
      .where('isAvailable', '==', true)
      .get();

    if (!snap.empty) {
      return snap.docs.map((d) => {
        const data = d.data();
        return {
          userId: d.id,
          fullName: data.fullName || 'Driver',
          phone: data.phone || '',
          email: data.email || '',
          verificationStatus: data.verificationStatus || 'approved',
          onlineStatus: Boolean(data.isAvailable),
          serviceAreas: data.serviceAreas || ['Coimbatore'],
          activeVehicleId: data.activeVehicleId,
          rating: data.rating || 5.0,
          totalTrips: data.completedTrips || 0,
          totalEarnings: data.totalEarnings || 0,
          currentLocation: data.currentLocation,
          createdAt: data.createdAt || '',
          updatedAt: data.updatedAt || '',
        };
      });
    }

    // Fallback to driverProfiles
    const legacySnap = await db
      .collection('driverProfiles')
      .where('verificationStatus', '==', 'approved')
      .where('onlineStatus', '==', true)
      .get();
    return legacySnap.docs.map((doc) => doc.data() as DriverProfile);
  }
}
