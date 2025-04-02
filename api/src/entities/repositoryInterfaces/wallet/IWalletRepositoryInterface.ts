import { IWallet } from "../../models/wallet.entity";
import { ObjectId } from "mongoose";

export interface IWalletRepository {
    create(wallet: Partial<IWallet>): Promise<IWallet>;
    update(id: string | ObjectId, wallet: Partial<IWallet>): Promise<IWallet>;
    delete(id: string | ObjectId): Promise<void>;
    findWalletById(id: string | ObjectId): Promise<IWallet | null>;
    findWalletByUserId(userId: string | ObjectId): Promise<IWallet>;
    addBalance(id: string | ObjectId, amount: number): Promise<IWallet>;
}