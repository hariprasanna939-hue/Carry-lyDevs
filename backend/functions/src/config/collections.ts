/**
 * CARRY Firestore Collections Constants
 * Exactly matching the production Firestore database structure
 */
export const COLLECTIONS = {
  USERS: 'users',
  DRIVER_APPLICATIONS: 'driverApplications',
  DRIVERS: 'drivers',
  VEHICLES: 'vehicles',
  BOOKINGS: 'bookings',
  DRIVER_JOB_OFFERS: 'driverJobOffers',
  TRIPS: 'trips',
  PAYMENTS: 'payments',
  DRIVER_EARNINGS: 'driverEarnings',
  SAVED_ADDRESSES: 'savedAddresses',
  NOTIFICATIONS: 'notifications',
  REVIEWS: 'reviews',
  SUPPORT_TICKETS: 'supportTickets',
  PRICING_CONFIG: 'pricingConfig',
  ADMIN_AUDIT_LOGS: 'adminAuditLogs',

  // Aliases for legacy / backward compatibility
  DRIVER_PROFILES: 'drivers',
  DISPATCH_REQUESTS: 'driverJobOffers',
  AUDIT_LOGS: 'adminAuditLogs',
  PRICING_CONFIGS: 'pricingConfig',
  DEVICE_TOKENS: 'deviceTokens',
  DRIVER_LOCATIONS: 'driverLocations',
  DRIVER_DOCUMENTS: 'driverDocuments',
} as const;

export type CollectionName = (typeof COLLECTIONS)[keyof typeof COLLECTIONS];
