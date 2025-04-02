import { IWallet } from "../../models/wallet.entity";

export interface IGetWalletDeatailsUseCase {
    execute(userId:string):Promise<IWallet>
}