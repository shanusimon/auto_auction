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
