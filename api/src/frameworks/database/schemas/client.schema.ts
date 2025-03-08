import { Schema } from "mongoose";
import { ROLES } from "../../../shared/constants";
import { IClientModel } from "../models/client.model";
import { WALLET_TRANSACTION_TYPES } from "../../../shared/constants";

const WalletTransactionSchema = new Schema({
    type:{type:String,enum:Object.values(WALLET_TRANSACTION_TYPES),required:true},
    amount:{type:Number,required:true},
    timestamp:{type:Date,default:Date.now,required:true}
})

export const ClientSchema = new Schema<IClientModel>({
    clientId: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String },
    profileImage: { type: String },
    walletBalance: { type: Number, default: 0 },
    joinedAt: { type: Date, default: Date.now },
    role: { type: String, enum: Object.values(ROLES),default:ROLES.USER, required: true },
    isBlocked: { type: Boolean, default: false },
    bids: [{ type: String }],
    listings: [{ type: String }],
    joinedCommunities: [{ type: String }],
    walletTransactions: [{ type: [WalletTransactionSchema],default:[] }],
},
{timestamps:true}
);
