import { TRole } from "../../shared/constants";
import { ObjectId } from "mongoose";

export interface IUserEntity {
    id?: string;
    name?: string;
    email?: string;
    password: string;
    phone?: string;
    profileImage?: string;
    googleId: string;
    joinedAt?: Date;
    role: TRole;
    bio:string,
    isBlocked: Boolean;
    bids?: string[];
    listings?: string[];
    walletId: ObjectId | string

    // Seller Details
    isSeller?: boolean;
    sellerSince?: Date;

    // Professional Dealer (Needs Admin Approval)
    isProfessionalDealer?: boolean;
    businessDetails?: {
        licenseNumber?: string;
        businessName?: string;
        taxID?: string;
        website?: string;
    };
    approvalStatus?: "pending" | "approved" | "rejected";
}
