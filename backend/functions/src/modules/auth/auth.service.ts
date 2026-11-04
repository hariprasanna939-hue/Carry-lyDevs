import { AuthRepository } from './auth.repository';
import { RegisterInput } from './auth.validation';
import { UserProfile, UserRole } from '../../common/types/User';
import { getIsoTimestamp } from '../../common/utils/timestamps';
import { AppError } from '../../common/errors/AppError';
import { db, auth } from '../../config/firebase';
import { COLLECTIONS } from '../../config/collections';

export class AuthService {
  /**
   * 1. Create Profile
   */
  public static async registerUser(uid: string, input: RegisterInput): Promise<UserProfile> {
    const existing = await AuthRepository.getUserDoc(uid);
    const now = getIsoTimestamp();

    const roles: UserProfile['roles'] = input.role === 'driver' ? ['customer', 'driver'] : ['customer'];
    const activePortal = input.role === 'driver' ? 'driver' : 'customer';

    const profile: UserProfile = {
      uid,
      name: input.name,
      phone: input.phone,
      email: input.email,
      roles: existing ? Array.from(new Set([...existing.roles, ...roles])) : roles,
      activePortal: existing ? existing.activePortal : activePortal,
      accountStatus: 'active',
      createdAt: existing ? existing.createdAt : now,
      updatedAt: now,
      lastLoginAt: now,
    };

    await AuthRepository.createUserDoc(profile);
    await AuthRepository.setCustomUserClaims(uid, {
      roles: profile.roles,
      activePortal: profile.activePortal,
    });

    return profile;
  }

  /**
   * 2. Validate Session
   */
  public static async validateSession(uid: string) {
    const profile = await AuthRepository.getUserDoc(uid);
    if (!profile) {
      throw new AppError('not-found', 'User session invalid: user profile not found');
    }

    if (profile.accountStatus !== 'active') {
      throw new AppError(
        'permission-denied',
        `Account access blocked. Current status: ${profile.accountStatus}`
      );
    }

    const firebaseUser = await auth.getUser(uid);
    return {
      isValid: true,
      uid,
      roles: profile.roles,
      activePortal: profile.activePortal,
      accountStatus: profile.accountStatus,
      emailVerified: firebaseUser.emailVerified,
      customClaims: firebaseUser.customClaims || {},
    };
  }

  /**
   * 3. Logout-Related Cleanup
   */
  public static async cleanupSessionOnLogout(uid: string, fcmToken?: string) {
    const batch = db.batch();
    const now = getIsoTimestamp();

    // 1. Remove specific FCM device token if supplied
    if (fcmToken) {
      const tokenRef = db.collection(COLLECTIONS.DEVICE_TOKENS).doc(fcmToken);
      batch.delete(tokenRef);
    }

    // 2. Clear driver active session / onlineStatus if driver
    const driverRef = db.collection(COLLECTIONS.DRIVER_PROFILES).doc(uid);
    batch.set(
      driverRef,
      {
        onlineStatus: false,
        lastLogoutAt: now,
        updatedAt: now,
      },
      { merge: true }
    );

    // 3. Update user doc
    const userRef = db.collection(COLLECTIONS.USERS).doc(uid);
    batch.update(userRef, {
      lastLogoutAt: now,
      updatedAt: now,
    });

    await batch.commit();
    return { success: true, message: 'Session cleaned up successfully on logout' };
  }

  /**
   * 4. Role Verification
   */
  public static async verifyRole(uid: string, requiredRole: UserRole): Promise<boolean> {
    const profile = await AuthRepository.getUserDoc(uid);
    if (!profile) return false;
    return profile.roles.includes(requiredRole);
  }

  /**
   * 5. Account Status
   */
  public static async checkAccountStatus(uid: string) {
    const profile = await AuthRepository.getUserDoc(uid);
    if (!profile) {
      throw new AppError('not-found', 'User profile not found');
    }
    return {
      uid,
      accountStatus: profile.accountStatus,
      roles: profile.roles,
      activePortal: profile.activePortal,
    };
  }
}
