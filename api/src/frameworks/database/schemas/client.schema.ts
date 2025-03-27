import { Schema } from "mongoose";
import { ROLES } from "../../../shared/constants";
import { IClientModel } from "../models/client.model";
import { WALLET_TRANSACTION_TYPES } from "../../../shared/constants";

const WalletTransactionSchema = new Schema({
    type: { type: String, enum: Object.values(WALLET_TRANSACTION_TYPES), required: true },
    amount: { type: Number, required: true },
    timestamp: { type: Date, default: Date.now, required: true }
});

export const ClientSchema = new Schema<IClientModel>(
    {
        clientId: { type: String, required: true },
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        phone: { type: String },
        profileImage: { type: String },
        googleId:{type:String,default:null},
        walletBalance: { type: Number, default: 0 },
        bio:{type:String,default:""},
        joinedAt: { type: Date, default: Date.now },
        role: { type: String, enum: Object.values(ROLES), default: ROLES.USER, required: true },
        isBlocked: { type: Boolean, default: false },
        bids: [{ type: String }],
        listings: [{ type: String }],
        joinedCommunities: [{ type: String }],
        walletTransactions: [{ type: WalletTransactionSchema, default: [] }],


        isSeller: { type: Boolean, default: false },
        sellerSince: { type: Date },

        isProfessionalDealer: { type: Boolean, default: false },
        businessDetails: {
            licenseNumber: { type: String },
            businessName: { type: String },
            taxID: { type: String },
            website: { type: String }
        },
        approvalStatus: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" }
    },
    { timestamps: true }
);
