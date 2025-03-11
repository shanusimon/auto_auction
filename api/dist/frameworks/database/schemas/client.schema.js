"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientSchema = void 0;
const mongoose_1 = require("mongoose");
const constants_1 = require("../../../shared/constants");
const constants_2 = require("../../../shared/constants");
const WalletTransactionSchema = new mongoose_1.Schema({
    type: { type: String, enum: Object.values(constants_2.WALLET_TRANSACTION_TYPES), required: true },
    amount: { type: Number, required: true },
    timestamp: { type: Date, default: Date.now, required: true }
});
exports.ClientSchema = new mongoose_1.Schema({
    clientId: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String },
    profileImage: { type: String },
    walletBalance: { type: Number, default: 0 },
    joinedAt: { type: Date, default: Date.now },
    role: { type: String, enum: Object.values(constants_1.ROLES), default: constants_1.ROLES.USER, required: true },
    isBlocked: { type: Boolean, default: false },
    bids: [{ type: String }],
    listings: [{ type: String }],
    joinedCommunities: [{ type: String }],
    walletTransactions: [{ type: [WalletTransactionSchema], default: [] }],
}, { timestamps: true });
