import { IAdminWallet } from "../../models/admin.wallet.entity";


export interface IAdminWalletRepository{
    create(data:IAdminWallet):Promise<void>
    findById(walletId:string):Promise<IAdminWallet | null>;
     update(walletId: string, data: Partial<IAdminWallet>): Promise<void> 
     findSingle(): Promise<IAdminWallet | null>
}