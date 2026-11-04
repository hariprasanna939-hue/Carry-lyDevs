/**
 * CARRY System Constants & Business Rules
 */
export const CONSTANTS = {
  CITY: 'Coimbatore',
  DEFAULT_CURRENCY: 'INR',
  DEFAULT_SEARCH_RADIUS_KM: 7,
  MAX_SEARCH_RADIUS_KM: 20,
  REQUEST_TIMEOUT_SECONDS: 45,
  DRIVER_MAX_ACCEPT_TIME_SECONDS: 30,

  // Vehicle Categories
  VEHICLE_TYPES: {
    TWO_WHEELER: 'two_wheeler',
    THREE_WHEELER: 'three_wheeler',
    TATA_ACE: 'tata_ace',
    PICKUP_8FT: 'pickup_8ft',
  } as const,

  // User Roles
  ROLES: {
    CUSTOMER: 'customer',
    DRIVER: 'driver',
    ADMIN: 'admin',
  } as const,

  // Driver Verification Statuses
  VERIFICATION_STATUS: {
    UNSUBMITTED: 'unsubmitted',
    PENDING: 'pending',
    APPROVED: 'approved',
    REJECTED: 'rejected',
    SUSPENDED: 'suspended',
  } as const,

  // Booking Lifecycle Statuses
  BOOKING_STATUS: {
    CREATED: 'created',
    SEARCHING: 'searching',
    ACCEPTED: 'accepted',
    ARRIVED_AT_PICKUP: 'arrived_at_pickup',
    LOADING: 'loading',
    IN_TRANSIT: 'in_transit',
    ARRIVED_AT_DROP: 'arrived_at_drop',
    UNLOADING: 'unloading',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled',
  } as const,

  // Payment Statuses
  PAYMENT_STATUS: {
    PENDING: 'pending',
    PAID: 'paid',
    FAILED: 'failed',
    REFUNDED: 'refunded',
  } as const,

  // Payment Methods
  PAYMENT_METHODS: {
    ONLINE: 'online',
    CASH: 'cash',
    WALLET: 'wallet',
  } as const,

  // Default Base Pricing Matrix (Coimbatore)
  DEFAULT_RATES: {
    two_wheeler: {
      baseFare: 40,
      baseKm: 1,
      perKmRate: 10,
      perMinuteRate: 1,
      capacityKg: 20,
    },
    three_wheeler: {
      baseFare: 120,
      baseKm: 2,
      perKmRate: 18,
      perMinuteRate: 1.5,
      capacityKg: 500,
    },
    tata_ace: {
      baseFare: 220,
      baseKm: 2,
      perKmRate: 25,
      perMinuteRate: 2,
      capacityKg: 750,
    },
    pickup_8ft: {
      baseFare: 350,
      baseKm: 2,
      perKmRate: 32,
      perMinuteRate: 2.5,
      capacityKg: 1200,
    },
  },

  HELPER_COST_PER_PERSON: 150,
  GST_PERCENTAGE: 0.05, // 5% GST for goods transport
};
