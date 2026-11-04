import { beforeUserCreated } from 'firebase-functions/v2/identity';
import { db } from '../../config/firebase';
import { COLLECTIONS } from '../../config/collections';
import { getIsoTimestamp } from '../../common/utils/timestamps';

export const onUserCreated = beforeUserCreated(async (event) => {
  const user = event.data;
  if (!user) return;

  const now = getIsoTimestamp();
  const userRef = db.collection(COLLECTIONS.USERS).doc(user.uid);
  const doc = await userRef.get();

  if (!doc.exists) {
    await userRef.set({
      uid: user.uid,
      email: user.email || '',
      phone: user.phoneNumber || '',
      name: user.displayName || 'CARRY User',
      roles: ['customer'],
      activePortal: 'customer',
      accountStatus: 'active',
      createdAt: now,
      updatedAt: now,
    });
  }
});
