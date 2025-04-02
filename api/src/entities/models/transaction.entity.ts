import { ObjectId } from "mongoose";


export interface IWalletTransactionEntity{
    _id:string | ObjectId,
    walletId:string | ObjectId,
    type: "deposit" | "bid" | "outbid" | "tranfer",
    amount:number,
    receiptUrl?:string,
    status:"pending" | "completed" | "failed",
    stripePaymentId?: string,
    createdAt: Date;
    updatedAt: Date;
}