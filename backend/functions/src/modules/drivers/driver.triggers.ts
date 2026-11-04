import { onDocumentUpdated } from 'firebase-functions/v2/firestore';
import { COLLECTIONS } from '../../config/collections';
import { auth, db } from '../../config/firebase';

export const onDriverStatusUpdated = onDocumentUpdated(
  `${COLLECTIONS.DRIVER_PROFILES}/{driverId}`,
  async (event) => {
    const before = event.data?.before.data();
    const after = event.data?.after.data();
    const driverId = event.params.driverId;

    if (!before || !after) return;

    if (before.verificationStatus !== after.verificationStatus) {
      console.log(`Driver ${driverId} status updated to: ${after.verificationStatus}`);

      // If driver is approved, grant driver custom claim
      if (after.verificationStatus === 'approved') {
        const userRef = db.collection(COLLECTIONS.USERS).doc(driverId);
        const userDoc = await userRef.get();
        if (userDoc.exists) {
          const uData = userDoc.data();
          const roles = Array.from(new Set([...(uData?.roles || []), 'driver']));
          await userRef.update({ roles });
          await auth.setCustomUserClaims(driverId, {
            roles,
            activePortal: uData?.activePortal || 'driver',
          });
        }
      }
    }
  }
);
