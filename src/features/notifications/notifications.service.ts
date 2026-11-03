import { db } from "../../services/firebase";
import { collection, query, where, orderBy, onSnapshot, addDoc } from "firebase/firestore";
import { AppNotification } from "./notifications.types";

export const notificationsService = {
  subscribeUserNotifications(userId: string, onUpdate: (notifs: AppNotification[]) => void) {
    const q = query(
      collection(db, "notifications"),
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );

    return onSnapshot(q, (snap) => {
      const items = snap.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          userId: data.userId,
          title: data.title,
          body: data.body || data.message || "",
          read: data.read ?? false,
          createdAt: data.createdAt,
        } as AppNotification;
      });
      onUpdate(items);
    });
  },

  async sendNotification(
    userId: string,
    title: string,
    body: string
  ): Promise<string> {
    const docRef = await addDoc(collection(db, "notifications"), {
      userId,
      title,
      body,
      read: false,
      createdAt: new Date(),
    });
    return docRef.id;
  },
};
