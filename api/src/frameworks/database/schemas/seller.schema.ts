import { Schema } from "mongoose";
import { ISellerEntity } from "../../../entities/models/seller.entity";

export const SellerSchema = new Schema<ISellerEntity>(
    {
        userId: { type: Schema.Types.ObjectId, ref: "Client", required: true },
        isSeller: { type: Boolean, default: false },
        sellerSince: { type: Date },
        approvalStatus: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
        address: { type: String, required: true },
        identificationNumber: { type: String, required: true },
        isProfessionalDealer: { type: Boolean, default: false },
        businessDetails: {
            businessName: { type: String },
            licenseNumber: { type: String },
            taxID: { type: String },
            website: { type: String },
            yearsInBusiness: { type: String },
        },
    },
    { timestamps: true } 
);