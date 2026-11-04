/**
 * CARRY Environment & Configuration Variables
 */
export const ENV = {
  NODE_ENV: process.env.NODE_ENV || 'production',
  FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID || process.env.GCLOUD_PROJECT || 'carry-bd2d7',
  IS_PRODUCTION: process.env.NODE_ENV === 'production',
  IS_EMULATOR: Boolean(process.env.FUNCTIONS_EMULATOR),

  // Razorpay API Credentials
  RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID || '',
  RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET || '',
  RAZORPAY_WEBHOOK_SECRET: process.env.RAZORPAY_WEBHOOK_SECRET || '',

  // Google Maps Platform
  GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY || '',

  // SMS / Notifications
  SMS_API_KEY: process.env.SMS_API_KEY || '',
  SMS_SENDER_ID: process.env.SMS_SENDER_ID || 'CARRY',
  ADMIN_ALERT_EMAIL: process.env.ADMIN_ALERT_EMAIL || 'admin@carrylogistics.in',
};
