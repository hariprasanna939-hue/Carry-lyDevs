"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onUserCreated = onUserCreated;
const config_1 = require("../../config");
async function onUserCreated(uid, email, phone) {
    const userRef = config_1.db.collection("users").doc(uid);
    const existing = await userRef.get();
    if (!existing.exists) {
        await userRef.set({
            uid,
            email: email || "",
            phone: phone || "",
            roles: ["customer"],
            activePortal: "customer",
            driverVerificationStatus: "not_applied",
            accountStatus: "active",
            createdAt: new Date(),
            updatedAt: new Date(),
        });
    }
}
//# sourceMappingURL=index.js.map