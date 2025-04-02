import { model,ObjectId,Document } from "mongoose";
import { IWalletTransactionEntity } from "../../../entities/models/transaction.entity";
import { WalletTransactionSchema } from "../schemas/wallet.transaction.schema";

export interface IWalletTransactionModel extends IWalletTransactionEntity,Document {
    _id:ObjectId,
    walletId:ObjectId
}

export const WalletTransactionModel = model<IWalletTransactionModel>("WalletTransaction",WalletTransactionSchema)