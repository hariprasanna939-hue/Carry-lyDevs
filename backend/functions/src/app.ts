import { db, auth, messaging, storage } from './config/firebase';
import { ENV } from './config/environment';

/**
 * Main application bootstrap for CARRY Cloud Functions
 */
export class Application {
  public static async initialize(): Promise<void> {
    console.log(`[CARRY Backend] Initialized in ${ENV.NODE_ENV} environment.`);
  }
}

export { db, auth, messaging, storage, ENV };
