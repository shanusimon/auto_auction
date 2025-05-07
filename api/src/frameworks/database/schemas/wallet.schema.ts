import { Schema } from "mongoose";
import { IWalletModel } from "../models/wallet.model";

export const WalletSchema = new Schema<IWalletModel>(
    {
        userId:{type:Schema.Types.ObjectId,ref:"Client",required:false},

        availableBalance:{type:Number,required:true,default:0},

        reservedBalance:{
            type:Number,required:true,default:0,min:[0,"Reeserved balance cannot be negative"]
        }
    },
    {timestamps:true}
)