import { IAdminWallet } from "../../../entities/models/admin.wallet.entity";
import { AdminWalletModel } from "../../../frameworks/database/models/admin.wallet.model";
import { IAdminWalletRepository } from "../../../entities/repositoryInterfaces/adminWallet/IAdminWalletRepository";

export class adminWalletRepository implements IAdminWalletRepository {
  constructor() {}

  async create(data: IAdminWallet): Promise<void> {
    try {
      const newWallet = new AdminWalletModel(data);
      await newWallet.save();
    } catch (error) {
      console.error("Error creating admin wallet:", error);
      throw error;
    }
  }

  async findById(walletId: string): Promise<IAdminWallet | null> {
    try {
      const wallet = await AdminWalletModel.findById(walletId);
      return wallet;
    } catch (error) {
      console.error("Error finding admin wallet by ID:", error);
      return null;
    }
  }


  async update(walletId: string, data: Partial<IAdminWallet>): Promise<void> {
    try {
      await AdminWalletModel.findByIdAndUpdate(walletId, data, { new: true });
    } catch (error) {
      console.error("Error updating admin wallet:", error);
      throw error;
    }
  }

  async findSingle(): Promise<IAdminWallet | null> {
    try {
      const wallet = await AdminWalletModel.findOne(); 
      return wallet;
    } catch (error) {
      console.error("Error finding admin wallet:", error);
      return null;
    }
  }
}
