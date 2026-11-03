import { doc, getDoc, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../../services/firebase";
import { DriverProfile } from "../../types/driver";

export const driversService = {
  async getDriverProfile(driverId: string): Promise<DriverProfile | null> {
    const snap = await getDoc(doc(db, "driverProfiles", driverId));
    if (!snap.exists()) return null;
    return snap.data() as DriverProfile;
  },

  async applyAsDriver(profile: Partial<DriverProfile> & { userId: string }): Promise<void> {
    const driverData: any = {
      userId: profile.userId,
      fullName: profile.fullName || "Driver",
      phone: profile.phone || "",
      email: profile.email || "",
      verificationStatus: "pending",
      onlineStatus: false,
      serviceAreas: profile.serviceAreas || ["Gandhipuram", "RS Puram", "Peelamedu", "SIDCO", "Kurichi"],
      rating: 5.0,
      totalTrips: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    await setDoc(doc(db, "driverProfiles", profile.userId), driverData, { merge: true });
  },

  async setOnlineStatus(driverId: string, isOnline: boolean): Promise<void> {
    await updateDoc(doc(db, "driverProfiles", driverId), {
      onlineStatus: isOnline,
      updatedAt: serverTimestamp(),
    });
  },
};
