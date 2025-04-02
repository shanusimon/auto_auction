import { model, ObjectId } from "mongoose";
import { IWallet } from "../../../entities/models/wallet.entity";
import { WalletSchema } from "../schemas/wallet.schema";


export interface IWalletModel extends Omit<IWallet,"_id">, Document{
    _id:ObjectId,
    userId:ObjectId
}


export const WalletModel = model<IWalletModel>("Wallet",WalletSchema);