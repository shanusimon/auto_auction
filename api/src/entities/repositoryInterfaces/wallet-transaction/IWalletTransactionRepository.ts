import { ObjectId } from "mongoose";
import { IWalletTransactionEntity } from "../../models/transaction.entity";

export interface IWalletTransactionRepository{
    create(transaction:Partial<IWalletTransactionEntity>):Promise<IWalletTransactionEntity>;
    update(id:string | ObjectId,transactions:Partial<IWalletTransactionEntity>):Promise<IWalletTransactionEntity | null>
    findByStripePaymentId(stripePaymentId: string): Promise<IWalletTransactionEntity | null>;
    findByStripeIdAndUpdateStatus(stripePaymentId:string,status:string):Promise<IWalletTransactionEntity>;
    findTransactionsByWalletId(walletId:string,skip:number,limit:number):Promise<{ transactions: IWalletTransactionEntity[]; total: number }>;
}