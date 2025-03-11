"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateUniqueUid = void 0;
const crypto_1 = require("crypto");
const generateUniqueUid = (prefix = "auto_auction") => {
    return `auto_auction-${prefix}-${(0, crypto_1.randomUUID)().slice(10)}`;
};
exports.generateUniqueUid = generateUniqueUid;
