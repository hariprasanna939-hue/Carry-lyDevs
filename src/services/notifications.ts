import { db } from "./firebase";
import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore";

export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: "booking" | "payment" | "system";
  read: boolean;
  createdAt: unknown;
}

export const notificationsService = {
  subscribeUserNotifications(userId: string, onUpdate: (notifs: AppNotification[]) => void) {
    const q = query(
      collection(db, "notifications"),
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );

    return onSnapshot(q, (snap) => {
      const items = snap.docs.map((d) => ({ id: d.id, ...d.data() } as AppNotification));
      onUpdate(items);
    });
  },
};
