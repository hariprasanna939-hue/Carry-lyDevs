"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireUserRole = requireUserRole;
const config_1 = require("../config");
async function requireUserRole(uid, requiredRole) {
    const userDoc = await config_1.db.collection("users").doc(uid).get();
    if (!userDoc.exists) {
        throw new Error("User does not exist");
    }
    const data = userDoc.data();
    const roles = data?.roles || [];
    if (!roles.includes(requiredRole)) {
        throw new Error(`Forbidden: Requires role ${requiredRole}`);
    }
}
//# sourceMappingURL=roles.js.map