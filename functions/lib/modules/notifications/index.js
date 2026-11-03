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
exports.sendBookingNotificationInternal = sendBookingNotificationInternal;
const admin = __importStar(require("firebase-admin"));
const config_1 = require("../../config");
async function sendBookingNotificationInternal({ userId, title, body, type = "booking", bookingId, }) {
    const now = admin.firestore.FieldValue.serverTimestamp();
    // 1. Persist notification in `notifications/{notificationId}`
    const notifRef = config_1.db.collection("notifications").doc();
    const notifData = {
        id: notifRef.id,
        userId,
        title,
        body,
        type,
        bookingId: bookingId || null,
        read: false,
        createdAt: now,
    };
    await notifRef.set(notifData);
    // 2. Dispatch FCM Push Notification if user has fcmToken saved
    try {
        const userDoc = await config_1.db.collection("users").doc(userId).get();
        const fcmToken = userDoc.data()?.fcmToken;
        if (fcmToken) {
            await admin.messaging().send({
                token: fcmToken,
                notification: {
                    title,
                    body,
                },
                data: {
                    bookingId: bookingId || "",
                    type,
                },
            });
        }
    }
    catch (err) {
        // Non-blocking log if push token not present
        console.log(`Push notification dispatch skipped for ${userId}: ${err?.message}`);
    }
    return { success: true, notificationId: notifRef.id };
}
//# sourceMappingURL=index.js.map