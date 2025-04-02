import { Schema } from "mongoose";
import { IWalletModel } from "../models/wallet.model";

export const WalletSchema = new Schema<IWalletModel>(
    {
        userId:{type:Schema.Types.ObjectId,ref:"Client",required:false},
        balance:{type:Number,required:true,default:0},
    },
    {timestamps:true}
)