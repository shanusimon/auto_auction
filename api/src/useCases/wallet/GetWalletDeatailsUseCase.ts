import { IGetWalletDeatailsUseCase } from "../../entities/useCaseInterfaces/wallet/IGetWalletDeatailsUseCase";
import { inject, injectable } from "tsyringe";
import {
  ERROR_MESSAGES,
  HTTP_STATUS,
  SUCCESS_MESSAGES,
} from "../../shared/constants";
import { IWalletRepository } from "../../entities/repositoryInterfaces/wallet/IWalletRepositoryInterface";
import { IWallet } from "../../entities/models/wallet.entity";
import { CustomError } from "../../entities/utils/custom.error";
import { IWalletTransactionRepository } from "../../entities/repositoryInterfaces/wallet-transaction/IWalletTransactionRepository";

@injectable()
export class GetWalletDeatailsUseCase implements IGetWalletDeatailsUseCase {
  constructor(
    @inject("IWalletRepository") private _walletRepository: IWalletRepository,
  ) {}
  async execute(userId: string): Promise<IWallet> {
    if (!userId) {
      throw new CustomError(
        ERROR_MESSAGES.USER_NOT_FOUND,
        HTTP_STATUS.BAD_REQUEST
      );
    }
    const walletData = await this._walletRepository.findWalletByUserId(userId);
    if(!walletData){
        throw new CustomError(
            ERROR_MESSAGES.WALLET_NOT_FOUND,
            HTTP_STATUS.BAD_REQUEST
        )
    }
    return walletData
  }
}
