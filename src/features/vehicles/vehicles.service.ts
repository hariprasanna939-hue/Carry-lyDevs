import { collection, doc, getDoc, getDocs, query, setDoc, where } from "firebase/firestore";
import { db } from "../../services/firebase";
import { COIMBATORE_VEHICLE_CATEGORIES, VehicleCategory } from "../../constants/vehicles";
import { VehicleDocument } from "../../types/vehicle";

export const vehiclesService = {
  getAvailableVehicles(): VehicleCategory[] {
    return COIMBATORE_VEHICLE_CATEGORIES.filter((v) => v.isActive);
  },

  getVehicleById(id: string): VehicleCategory | undefined {
    return COIMBATORE_VEHICLE_CATEGORIES.find((v) => v.id === id);
  },

  async registerVehicle(vehicle: Omit<VehicleDocument, "id" | "createdAt" | "updatedAt">): Promise<string> {
    const docRef = doc(collection(db, "vehicles"));
    const data: VehicleDocument = {
      ...vehicle,
      id: docRef.id,
      verificationStatus: "pending",
      isActive: true,
      vehiclePhotos: vehicle.vehiclePhotos || [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    await setDoc(docRef, data);
    return docRef.id;
  },

  async getDriverVehicles(driverId: string): Promise<VehicleDocument[]> {
    const q = query(collection(db, "vehicles"), where("driverId", "==", driverId));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as VehicleDocument));
  },
};
