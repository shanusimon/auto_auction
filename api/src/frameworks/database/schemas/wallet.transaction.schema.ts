import { Schema } from "mongoose";
import { IWalletTransactionModel } from "../models/wallet.transaction.model";


export const WalletTransactionSchema = new Schema<IWalletTransactionModel>({
    walletId:{type:Schema.Types.ObjectId,ref:"Wallet",required:true},
    type: {
        type: String,
        enum: ["deposit", "bid", "outbid", "transfer"],
        required: true,
    },
    amount: { type: Number, required: true },
    receiptUrl:{type:String,required:false},
    status: {
        type: String,
        enum: ["pending", "completed", "failed"],
        default: "pending",
        required: true,
    },
    stripePaymentId: { type: String },
    },
    {timestamps:true}
);

