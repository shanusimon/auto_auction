import { ObjectId } from "mongoose";

export interface IWallet {
    _id:string | ObjectId,
    userId:string | ObjectId | null,
    balance:number,
    createdAt:Date,
    updatedAt:Date
}