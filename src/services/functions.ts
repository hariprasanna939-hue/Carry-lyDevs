import { getFunctions, httpsCallable } from "firebase/functions";
import { app } from "./firebase";

export const functions = getFunctions(app as any, "asia-south1");

export async function callCloudFunction<TRequest = any, TResponse = any>(
  name: string,
  data?: TRequest
): Promise<TResponse> {
  const callable = httpsCallable<TRequest, TResponse>(functions, name);
  const result = await callable(data);
  return result.data;
}

export const cloudFunctionsService = {
  createBooking: (data: {
    vehicleCategory: string;
    pickup: any;
    drop: any;
    items?: any[];
    helperCount?: number;
    scheduledAt?: string | null;
    distanceKm: number;
    paymentMethod?: string;
  }) => callCloudFunction("createBooking", data),

  calculateFare: (data: {
    city?: string;
    vehicleType: string;
    distanceKm: number;
    helperCount?: number;
  }) => callCloudFunction("calculateFare", data),

  findNearbyDrivers: (data: {
    vehicleCategory?: string;
    latitude: number;
    longitude: number;
    radiusKm?: number;
  }) => callCloudFunction("findNearbyDrivers", data),

  sendDriverRequest: (data: { bookingId: string; driverId: string }) =>
    callCloudFunction("sendDriverRequest", data),

  acceptBooking: (data: { bookingId: string }) =>
    callCloudFunction("acceptBooking", data),

  rejectBooking: (data: { bookingId: string; reason?: string }) =>
    callCloudFunction("rejectBooking", data),

  updateTripStatus: (data: {
    bookingId: string;
    nextStatus: string;
    pickupOtp?: string;
  }) => callCloudFunction("updateTripStatus", data),

  updateDriverLocation: (data: {
    latitude: number;
    longitude: number;
    bookingId?: string | null;
    heading?: number;
    speed?: number;
  }) => callCloudFunction("updateDriverLocation", data),

  completeBooking: (data: {
    bookingId: string;
    deliveryOtp?: string;
    proofPhotoUrl?: string;
  }) => callCloudFunction("completeBooking", data),

  createPaymentOrder: (data: {
    bookingId: string;
    amount: number;
    provider?: string;
  }) => callCloudFunction("createPaymentOrder", data),

  verifyPayment: (data: {
    paymentId: string;
    bookingId: string;
    providerPaymentId: string;
    signature?: string;
  }) => callCloudFunction("verifyPayment", data),

  submitDriverApplication: (data: {
    fullName: string;
    phone: string;
    email?: string;
    serviceAreas?: string[];
    vehicleType: string;
    registrationNumber: string;
    capacityKg: number;
    vehiclePhotos?: string[];
    documents?: any;
  }) => callCloudFunction("submitDriverApplication", data),

  approveDriver: (data: {
    driverId: string;
    vehicleId?: string;
    approved: boolean;
    rejectionReason?: string;
  }) => callCloudFunction("approveDriver", data),

  sendBookingNotification: (data: {
    userId: string;
    title: string;
    body: string;
    type?: string;
    bookingId?: string;
  }) => callCloudFunction("sendBookingNotification", data),
};
