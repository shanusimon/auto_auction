import { injectable } from "tsyringe";
import { ObjectId } from "mongoose";
import { IWalletTransactionEntity } from "../../../entities/models/transaction.entity";
import { IWalletTransactionRepository } from "../../../entities/repositoryInterfaces/wallet-transaction/IWalletTransactionRepository";
import { WalletTransactionModel } from "../../../frameworks/database/models/wallet.transaction.model";

@injectable()
export class WalletTransactionRepository implements IWalletTransactionRepository {
    async create(transaction: Partial<IWalletTransactionEntity>): Promise<IWalletTransactionEntity> {
        const created = await WalletTransactionModel.create(transaction);
        return this.mapToEntity(created);
    }

    async update(id: string | ObjectId, transaction: Partial<IWalletTransactionEntity>): Promise<IWalletTransactionEntity | null> {
        const updated = await WalletTransactionModel.findByIdAndUpdate(id, transaction, { new: true });
        if (!updated) return null;
        return this.mapToEntity(updated);
    }

    async findByStripePaymentId(stripePaymentId: string): Promise<IWalletTransactionEntity | null> {
        const transaction = await WalletTransactionModel.findOne({ stripePaymentId });
        if (!transaction) return null;
        return this.mapToEntity(transaction);
    }

    async findByStripeIdAndUpdateStatus(stripePaymentId: string, status: string): Promise<IWalletTransactionEntity> {
        const transaction = await WalletTransactionModel.findOneAndUpdate(
            { stripePaymentId },
            { status },
            { new: true }
        );
        if (!transaction) {
            throw new Error(`Transaction with stripePaymentId ${stripePaymentId} not found`);
        }
        return this.mapToEntity(transaction);
    }
    async findTransactionsByWalletId(walletId: string, skip: number, limit: number): Promise<{transactions:IWalletTransactionEntity[];total:number}> {
        const transactions = await WalletTransactionModel.find({walletId}).skip(skip).limit(limit).sort({createdAt:-1});

        const total = await WalletTransactionModel.countDocuments({walletId})
        return {
            transactions:this.mapToEntities(transactions),
            total
        }
    }
    private mapToEntity(doc: any): IWalletTransactionEntity {
        return {
            _id: doc._id,
            walletId: doc.walletId,
            type: doc.type,
            amount: doc.amount,
            status: doc.status,
            stripePaymentId: doc.stripePaymentId,
            receiptUrl: doc.receiptUrl, 
            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt,
        };
    }
    private mapToEntities(docs: any[]): IWalletTransactionEntity[] {
        return docs.map(doc => this.mapToEntity(doc));
    }
}