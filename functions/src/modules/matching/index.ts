import * as admin from "firebase-admin";
import { db } from "../../config";
import { calculateDistanceKm } from "../../utils";

export interface FindNearbyDriversParams {
  vehicleCategory?: string;
  latitude: number;
  longitude: number;
  radiusKm?: number;
}

export interface NearbyDriverResult {
  driverId: string;
  fullName: string;
  phone: string;
  rating: number;
  totalTrips: number;
  distanceKm: number;
  latitude: number;
  longitude: number;
}

export async function findNearbyDriversInternal({
  vehicleCategory,
  latitude,
  longitude,
  radiusKm = 15,
}: FindNearbyDriversParams): Promise<NearbyDriverResult[]> {
  // Query verified online drivers
  const driversSnap = await db
    .collection("driverProfiles")
    .where("verificationStatus", "==", "approved")
    .where("onlineStatus", "==", true)
    .limit(50)
    .get();

  if (driversSnap.empty) {
    return [];
  }

  const driverIds = driversSnap.docs.map((d) => d.id);

  // Fetch their latest known locations
  const locationRefs = driverIds.map((id) => db.collection("driverLocations").doc(id));
  const locationDocs = await db.getAll(...locationRefs);

  const results: NearbyDriverResult[] = [];

  for (let i = 0; i < driversSnap.docs.length; i++) {
    const driverDoc = driversSnap.docs[i];
    const driverData = driverDoc.data();
    const locDoc = locationDocs[i];

    if (!locDoc.exists) continue;
    const locData = locDoc.data();
    if (!locData || locData.latitude === undefined || locData.longitude === undefined) continue;

    // If driver is already on an active booking, skip them
    if (locData.bookingId) continue;

    const dist = calculateDistanceKm(
      latitude,
      longitude,
      locData.latitude,
      locData.longitude
    );

    if (dist <= radiusKm) {
      results.push({
        driverId: driverDoc.id,
        fullName: driverData.fullName || "Partner Driver",
        phone: driverData.phone || "",
        rating: Number(driverData.rating) || 5.0,
        totalTrips: Number(driverData.totalTrips) || 0,
        distanceKm: dist,
        latitude: locData.latitude,
        longitude: locData.longitude,
      });
    }
  }

  // Sort by nearest distance
  results.sort((a, b) => a.distanceKm - b.distanceKm);
  return results;
}

export async function sendDriverRequestInternal(bookingId: string, driverId: string) {
  const bookingRef = db.collection("bookings").doc(bookingId);
  const bookingSnap = await bookingRef.get();

  if (!bookingSnap.exists) {
    throw new Error("Booking not found");
  }

  const bookingData = bookingSnap.data();
  if (bookingData?.bookingStatus !== "searching") {
    throw new Error(`Cannot send request. Booking is already ${bookingData?.bookingStatus}`);
  }

  const now = admin.firestore.FieldValue.serverTimestamp();

  // Create notification for driver
  const notifRef = db.collection("notifications").doc();
  await notifRef.set({
    userId: driverId,
    title: "New Cargo Booking Request 🚚",
    body: `Pickup at ${bookingData.pickup?.address || "Coimbatore"}. Fare: ₹${bookingData.totalFare || ""}`,
    read: false,
    type: "booking",
    bookingId,
    createdAt: now,
  });

  // Record dispatch event
  await db.collection("bookingEvents").add({
    bookingId,
    eventType: "driver_requested",
    description: `Trip request dispatched to driver ${driverId}`,
    createdBy: "system",
    createdAt: now,
  });

  return { success: true, bookingId, driverId };
}
