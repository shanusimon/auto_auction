import { TRole,IWalletTransaction } from "../../shared/constants"


export interface IUserEntity{
    id?:string;
    name?:string;
    email?:string;
    password:string;
    phone?:string;
    profileImage?:string;
    walletBalance?:number;
    joinedAt?:Date;
    role:TRole;
    isBlocked:Boolean;
    bids?:string[];
    listings?:string[];
    joinedCommunities?:string[];
    walletTransactions?:IWalletTransaction[];
}
