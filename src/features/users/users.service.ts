import { doc, getDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "../../services/firebase";
import { CarryUser, ActivePortal } from "../../types/user";
import { UpdateUserProfilePayload } from "./users.types";

export const usersService = {
  async getProfile(uid: string): Promise<CarryUser | null> {
    const snap = await getDoc(doc(db, "users", uid));
    if (!snap.exists()) return null;
    return { uid: snap.id, ...snap.data() } as CarryUser;
  },

  async updateProfile(uid: string, data: UpdateUserProfilePayload): Promise<void> {
    await updateDoc(doc(db, "users", uid), {
      ...data,
      updatedAt: serverTimestamp(),
    });
  },

  async switchPortal(uid: string, portal: ActivePortal): Promise<void> {
    await updateDoc(doc(db, "users", uid), {
      activePortal: portal,
      updatedAt: serverTimestamp(),
    });
  },
};
