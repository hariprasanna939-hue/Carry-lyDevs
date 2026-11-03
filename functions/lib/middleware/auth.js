"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyAuthToken = verifyAuthToken;
const config_1 = require("../config");
async function verifyAuthToken(header) {
    if (!header || !header.startsWith("Bearer ")) {
        throw new Error("Unauthorized: Missing or malformed authorization header");
    }
    const token = header.split("Bearer ")[1];
    const decoded = await config_1.auth.verifyIdToken(token);
    return decoded.uid;
}
//# sourceMappingURL=auth.js.map