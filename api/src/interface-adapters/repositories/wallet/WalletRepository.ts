import { injectable } from "tsyringe";
import { IWallet } from "../../../entities/models/wallet.entity";
import { IWalletRepository } from "../../../entities/repositoryInterfaces/wallet/IWalletRepositoryInterface";
import { WalletModel } from "../../../frameworks/database/models/wallet.model";
import { ObjectId } from "mongoose";

@injectable()
export class WalletRepository implements IWalletRepository {
    async create(wallet: Partial<IWallet>): Promise<IWallet> {
        const createdWallet = await WalletModel.create(wallet);
        return {
            _id: createdWallet._id,
            userId: createdWallet.userId,
            balance: createdWallet.balance,
            createdAt: createdWallet.createdAt,
            updatedAt: createdWallet.updatedAt,
        };
    }

    async update(id: string | ObjectId, wallet: Partial<IWallet>): Promise<IWallet> {
        const updatedWallet = await WalletModel.findByIdAndUpdate(id, wallet, { new: true });

        if (!updatedWallet) {
            throw new Error("Wallet not found");
        }

        return {
            _id: updatedWallet._id,
            userId: updatedWallet.userId,
            balance: updatedWallet.balance,
            createdAt: updatedWallet.createdAt,
            updatedAt: updatedWallet.updatedAt,
        };
    }

    async delete(id: string | ObjectId): Promise<void> {
        await WalletModel.deleteOne({ _id: id });
    }

    async findWalletById(id: string | ObjectId): Promise<IWallet | null> {
        return await WalletModel.findById(id);
    }

    async findWalletByUserId(userId: string | ObjectId): Promise<IWallet> {
        const wallet = await WalletModel.findOne({ userId });
        if (!wallet) {
            throw new Error("Wallet not found");
        }
        return wallet;
    }

    async addBalance(id: string | ObjectId, amount: number): Promise<IWallet> {
        const wallet = await WalletModel.findById(id);
        
        if (!wallet) {
            throw new Error("Wallet not found");
        }

        const updatedWallet = await WalletModel.findByIdAndUpdate(
            id,
            { 
                $inc: { balance: amount },
                updatedAt: new Date()
            },
            { new: true }
        );

        if (!updatedWallet) {
            throw new Error("Failed to update wallet balance");
        }

        return {
            _id: updatedWallet._id,
            userId: updatedWallet.userId,
            balance: updatedWallet.balance,
            createdAt: updatedWallet.createdAt,
            updatedAt: updatedWallet.updatedAt,
        };
    }
}