import { TRole, IWalletTransaction } from "../../shared/constants";

export interface IUserEntity {
    id?: string;
    name?: string;
    email?: string;
    password: string;
    phone?: string;
    profileImage?: string;
    googleId: string;
    walletBalance?: number;
    joinedAt?: Date;
    role: TRole;
    bio:string,
    isBlocked: Boolean;
    bids?: string[];
    listings?: string[];
    joinedCommunities?: string[];
    walletTransactions?: IWalletTransaction[];

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
