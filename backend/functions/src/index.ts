/**
 * CARRY — Official Production Cloud Functions API
 * Coimbatore Logistics & Transportation Platform
 *
 * Implements the complete major API functions suite:
 * - 30 Callable Functions for mobile & admin apps
 * - Event-driven Firestore triggers & cron jobs
 */

// ===============================================================
// 1. User & Authentication Functions
// ===============================================================
export {
  createUserProfile,
  registerUser,
  validateSession,
  cleanupSessionOnLogout,
  verifyUserRole,
  checkAccountStatus,
  onUserCreated,
} from './modules/auth';

export {
  getMyProfile,
  getUserProfile,
  updateMyProfile,
  updateUserProfile,
  uploadUserPhoto,
  deactivateAccount,
  switchPortal,
} from './modules/users';

// ===============================================================
// 2. Driver Onboarding & Management Functions
// ===============================================================
export {
  submitDriverApplication,
  saveDriverOnboardingDraft,
  saveDriverDraft,
  getDriverApplication,
  getDriverVerificationStatus,
  checkDriverApproval,
  updateDriverAvailability,
  updateDriverDetails,
  uploadDriverDocument,
  getDriverProfile,
  onDriverStatusUpdated,
} from './modules/drivers';

// ===============================================================
// 3. Vehicles Module
// ===============================================================
export {
  registerVehicle,
  updateVehicle,
  listVehicleSizes,
  validateVehicleDocuments,
  getMyVehicles,
} from './modules/vehicles';

// ===============================================================
// 4. Bookings Module
// ===============================================================
export {
  createBooking,
  getBookingDetails,
  getBooking,
  cancelBooking,
  getMyBookings,
  listCustomerBookings,
  rescheduleBooking,
  onBookingCreated,
} from './modules/bookings';

// ===============================================================
// 5. Pricing Module
// ===============================================================
export {
  calculateFare,
  getVehicleRateDetails,
  calculateDistanceCharge,
  calculateHelperCharge,
  calculateAdditionalCharges,
} from './modules/pricing';

// ===============================================================
// 6. Dispatch & Job Offer Functions
// ===============================================================
export {
  findAvailableDrivers,
  findNearbyDrivers,
  sendDriverJobOffers,
  sendJobRequest,
  respondToJobOffer,
  matchVehicleSize,
  assignDriver,
  acceptBooking,
  rejectBooking,
  onDispatchRequestUpdated,
} from './modules/dispatch';

// ===============================================================
// 7. Trips & Live Tracking Functions
// ===============================================================
export {
  startTrip,
  updateTripLocation,
  updateDriverLocation,
  completeTrip,
  markPickup,
  acceptTripJob,
  updateTripStatus,
  onTripStatusChanged,
} from './modules/trips';

// ===============================================================
// 8. Payments & Earnings Functions
// ===============================================================
export {
  createPaymentOrder,
  verifyPayment,
  processPaymentWebhook,
  createRefund,
  processRefund,
  getDriverEarnings,
  getPaymentHistory,
  getInvoice,
} from './modules/payments';

// ===============================================================
// 9. Notifications Module
// ===============================================================
export {
  registerPushToken,
  registerDeviceToken,
  sendBookingNotification,
  sendDriverRequestNotification,
  sendTripReminderNotification,
  sendPaymentNotification,
  onNotificationCreated,
} from './modules/notifications';

// ===============================================================
// 10. Reviews Module
// ===============================================================
export {
  submitReview,
  reviewDriver,
  getDriverRatingSummary,
} from './modules/reviews';

// ===============================================================
// 11. Addresses Module
// ===============================================================
export {
  saveAddress,
  editAddress,
  deleteAddress,
  listSavedAddresses,
} from './modules/addresses';

// ===============================================================
// 12. Support Module
// ===============================================================
export {
  createSupportTicket,
  attachTicketEvidence,
  trackSupportTicket,
  resolveSupportTicket,
  getMySupportTickets,
} from './modules/support';

// ===============================================================
// 13. Admin & Fare Configuration Functions
// ===============================================================
export {
  approveDriver,
  rejectDriver,
  updatePricingConfig,
  adminUpdatePricing,
  adminCancelBooking,
  adminListBookings,
  adminSuspendUser,
  adminActivateUser,
  adminListUsers,
  adminResolveDispute,
} from './modules/admin';

// ===============================================================
// 14. Analytics Module
// ===============================================================
export {
  getBookingCounts,
  getActiveDrivers,
  getRevenueSummary,
  getCancellationAndCompletionRates,
} from './modules/analytics';

// ===============================================================
// 15. Scheduled Background Jobs
// ===============================================================
export {
  checkScheduledBookings,
  sendDriverTripReminders,
  cancelStaleSearchingBookings,
  cleanupExpiredDispatchRequests,
} from './modules/scheduled';
