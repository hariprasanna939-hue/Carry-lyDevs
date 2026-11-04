import { doc, getDoc, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../../services/firebase";
import { DriverProfile } from "../../types/driver";

export const driversService = {
  async getDriverProfile(driverId: string): Promise<DriverProfile | null> {
    try {
      // 1. Check primary `drivers/{uid}`
      const driverSnap = await getDoc(doc(db, "drivers", driverId));
      if (driverSnap.exists()) {
        const d = driverSnap.data();
        return {
          userId: driverId,
          fullName: d.fullName || "Driver",
          phone: d.phone || "",
          email: d.email || "",
          verificationStatus: d.verificationStatus || "approved",
          onlineStatus: Boolean(d.isAvailable ?? d.onlineStatus),
          serviceAreas: d.serviceAreas || ["Gandhipuram", "RS Puram", "Peelamedu", "SIDCO", "Kurichi"],
          rating: d.rating ?? 5.0,
          totalTrips: d.completedTrips ?? d.totalTrips ?? 0,
          activeVehicleId: d.activeVehicleId,
          createdAt: d.createdAt,
          updatedAt: d.updatedAt,
        } as DriverProfile;
      }

      // 2. Check legacy `driverProfiles/{uid}`
      const snap = await getDoc(doc(db, "driverProfiles", driverId));
      if (snap.exists()) {
        return snap.data() as DriverProfile;
      }

      // 3. Check `driverApplications/{uid}`
      const appSnap = await getDoc(doc(db, "driverApplications", driverId));
      if (appSnap.exists()) {
        const app = appSnap.data();
        return {
          userId: driverId,
          fullName: app.personalDetails?.fullName || "Driver",
          phone: app.personalDetails?.phone || "",
          email: app.personalDetails?.email || "",
          verificationStatus: app.approvalStatus || "pending",
          onlineStatus: false,
          serviceAreas: ["Coimbatore"],
          rating: 5.0,
          totalTrips: 0,
        } as DriverProfile;
      }

      return null;
    } catch (err) {
      console.warn("[driversService.getDriverProfile] Error fetching driver profile:", err);
      return null;
    }
  },

  async applyAsDriver(profile: Partial<DriverProfile> & { userId: string }): Promise<void> {
    const driverData: any = {
      userId: profile.userId,
      fullName: profile.fullName || "Driver",
      phone: profile.phone || "",
      email: profile.email || "",
      verificationStatus: "pending",
      isAvailable: false,
      onlineStatus: false,
      serviceAreas: profile.serviceAreas || ["Gandhipuram", "RS Puram", "Peelamedu", "SIDCO", "Kurichi"],
      rating: 5.0,
      totalTrips: 0,
      completedTrips: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    // Save to both `drivers` and `driverProfiles`
    await setDoc(doc(db, "drivers", profile.userId), driverData, { merge: true });
    await setDoc(doc(db, "driverProfiles", profile.userId), driverData, { merge: true });
  },

  async setOnlineStatus(driverId: string, isOnline: boolean): Promise<void> {
    const updates = {
      isAvailable: isOnline,
      onlineStatus: isOnline,
      updatedAt: serverTimestamp(),
    };

    try {
      await updateDoc(doc(db, "drivers", driverId), updates);
    } catch {
      await setDoc(doc(db, "drivers", driverId), updates, { merge: true });
    }

    try {
      await updateDoc(doc(db, "driverProfiles", driverId), updates);
    } catch {
      await setDoc(doc(db, "driverProfiles", driverId), updates, { merge: true });
    }
  },
};
