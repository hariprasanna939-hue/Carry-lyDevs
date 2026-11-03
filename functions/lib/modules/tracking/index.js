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
exports.updateDriverLocationInternal = updateDriverLocationInternal;
const admin = __importStar(require("firebase-admin"));
const config_1 = require("../../config");
async function updateDriverLocationInternal({ driverId, latitude, longitude, bookingId = null, heading = 0, speed = 0, }) {
    if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
        throw new Error("Invalid GPS coordinates.");
    }
    const now = admin.firestore.FieldValue.serverTimestamp();
    await config_1.db.collection("driverLocations").doc(driverId).set({
        driverId,
        latitude,
        longitude,
        bookingId,
        heading,
        speed,
        updatedAt: now,
    }, { merge: true });
    return { success: true, driverId, updatedAt: new Date() };
}
//# sourceMappingURL=index.js.map