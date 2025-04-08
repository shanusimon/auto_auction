import { Schema } from "mongoose";
import { ROLES } from "../../../shared/constants";
import { IClientModel } from "../models/client.model";


export const ClientSchema = new Schema<IClientModel>(
    {
        clientId: { type: String, required: true },
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        phone: { type: String },
        profileImage: { type: String },
        googleId:{type:String,default:null},
        bio:{type:String,default:""},
        joinedAt: { type: Date, default: Date.now },
        role: { type: String, enum: Object.values(ROLES), default: ROLES.USER, required: true },
        isBlocked: { type: Boolean, default: false },
        bids: [{ type: String }],
        listings: [{ type: String }],
        walletId:{type:Schema.Types.ObjectId,ref:"Wallet",required:true},
        fcmToken:{type:String,default:null},
        isSeller: { type: Boolean, default: false },
        sellerId: { type: Schema.Types.ObjectId, ref: "Seller", default: null },
    },
    { timestamps: true }
);
