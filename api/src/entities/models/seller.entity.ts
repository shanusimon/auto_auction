import { ObjectId } from "mongoose";

export interface ISellerEntity {
    _id?: string | ObjectId;
    userId: ObjectId; 
    isSeller: boolean; 
    sellerSince?: Date; 
    approvalStatus: "pending" | "approved" | "rejected";
    address: string;
    identificationNumber: string;
    isActive:boolean;

    isProfessionalDealer: boolean;
    businessDetails?: {
        businessName?: string;
        licenseNumber?: string;
        taxID?: string;
        website?: string;
        yearsInBusiness?: string;
    };
    createdAt?: Date; 
    updatedAt?: Date; 
}