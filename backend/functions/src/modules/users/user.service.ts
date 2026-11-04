import { UserRepository } from './user.repository';
import { UpdateProfileInput, SwitchPortalInput } from './user.types';
import { AppError } from '../../common/errors/AppError';
import { getIsoTimestamp } from '../../common/utils/timestamps';
import { COLLECTIONS } from '../../config/collections';
import { db, auth } from '../../config/firebase';

export class UserService {
  /**
   * 1. Get profile
   */
  public static async getProfile(uid: string) {
    const user = await UserRepository.getById(uid);
    if (!user) throw new AppError('not-found', 'User profile not found');
    return user;
  }

  /**
   * 2. Update profile
   */
  public static async updateProfile(uid: string, input: UpdateProfileInput) {
    const user = await this.getProfile(uid);
    const updates: Record<string, unknown> = {
      ...input,
      updatedAt: getIsoTimestamp(),
    };
    await UserRepository.update(uid, updates);
    return { ...user, ...updates };
  }

  /**
   * 3. Upload / Update Photo
   */
  public static async updateUserPhoto(uid: string, photoURL: string) {
    if (!photoURL || typeof photoURL !== 'string') {
      throw new AppError('invalid-argument', 'Valid photo URL is required');
    }

    const updates = {
      photoURL: photoURL.trim(),
      updatedAt: getIsoTimestamp(),
    };

    await UserRepository.update(uid, updates);
    // Also mirror to firebase auth profile if possible
    try {
      await auth.updateUser(uid, { photoURL });
    } catch (err) {
      console.warn(`Failed to mirror photoURL to Firebase Auth:`, err);
    }

    return { uid, photoURL };
  }

  /**
   * 4. Deactivate Account
   */
  public static async deactivateAccount(uid: string, reason?: string) {
    const user = await this.getProfile(uid);
    const now = getIsoTimestamp();

    await UserRepository.update(uid, {
      accountStatus: 'suspended',
      deactivatedAt: now,
      deactivationReason: reason || 'Requested by user',
      updatedAt: now,
    });

    // Disable in Firebase Auth
    await auth.updateUser(uid, { disabled: true });

    return {
      uid,
      accountStatus: 'suspended',
      message: 'Account successfully deactivated',
    };
  }

  /**
   * Portal Switching
   */
  public static async switchPortal(uid: string, input: SwitchPortalInput) {
    const user = await this.getProfile(uid);
    if (input.portal === 'driver') {
      const driverDoc = await db.collection(COLLECTIONS.DRIVER_PROFILES).doc(uid).get();
      if (!driverDoc.exists) {
        throw new AppError('failed-precondition', 'Driver profile does not exist. Please apply as a driver first.');
      }
    }

    await UserRepository.update(uid, {
      activePortal: input.portal,
      updatedAt: getIsoTimestamp(),
    });

    await auth.setCustomUserClaims(uid, {
      roles: user.roles,
      activePortal: input.portal,
    });

    return { activePortal: input.portal };
  }
}
