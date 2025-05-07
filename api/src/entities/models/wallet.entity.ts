import { ObjectId } from "mongoose";

export interface IWallet {
    _id:string | ObjectId,
    userId:string | ObjectId | null,
    availableBalance:number,
    reservedBalance:number,
    createdAt:Date,
    updatedAt:Date
}