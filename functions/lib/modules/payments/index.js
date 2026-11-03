"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPaymentOrderInternal = createPaymentOrderInternal;
exports.verifyPaymentInternal = verifyPaymentInternal;
const admin = __importStar(require("firebase-admin"));
const crypto = __importStar(require("crypto"));
const config_1 = require("../../config");
async function createPaymentOrderInternal({ bookingId, customerId, amount, provider, }) {
    const bookingSnap = await config_1.db.collection("bookings").doc(bookingId).get();
    if (!bookingSnap.exists) {
        throw new Error("Booking not found");
    }
    const now = admin.firestore.FieldValue.serverTimestamp();
    const paymentRef = config_1.db.collection("payments").doc();
    // Generate simulated or real provider order ID
    const providerPaymentId = `order_${Date.now()}_${bookingId.slice(-4)}`;
    const paymentData = {
        id: paymentRef.id,
        bookingId,
        customerId,
        amount,
        provider,
        providerPaymentId,
        paymentStatus: provider === "cash" ? "pending" : "pending",
        createdAt: now,
    };
    await paymentRef.set(paymentData);
    return {
        success: true,
        paymentId: paymentRef.id,
        orderId: providerPaymentId,
        amount,
        currency: "INR",
        provider,
    };
}
async function verifyPaymentInternal({ paymentId, bookingId, providerPaymentId, signature, secret, }) {
    const paymentRef = config_1.db.collection("payments").doc(paymentId);
    const bookingRef = config_1.db.collection("bookings").doc(bookingId);
    // If Razorpay HMAC signature is provided and secret configured, verify cryptographically
    if (signature && secret) {
        const generatedSignature = crypto
            .createHmac("sha256", secret)
            .update(`${bookingId}|${providerPaymentId}`)
            .digest("hex");
        if (generatedSignature !== signature) {
            throw new Error("Payment signature verification failed.");
        }
    }
    const now = admin.firestore.FieldValue.serverTimestamp();
    await config_1.db.runTransaction(async (transaction) => {
        transaction.update(paymentRef, {
            paymentStatus: "paid",
            providerPaymentId,
            completedAt: now,
        });
        transaction.update(bookingRef, {
            paymentStatus: "paid",
            paymentId,
            updatedAt: now,
        });
        const eventRef = config_1.db.collection("bookingEvents").doc();
        transaction.set(eventRef, {
            bookingId,
            eventType: "payment_received",
            description: `Payment of verified via ${providerPaymentId}`,
            createdBy: "system",
            createdAt: now,
        });
    });
    return { success: true, bookingId, paymentStatus: "paid" };
}
//# sourceMappingURL=index.js.map