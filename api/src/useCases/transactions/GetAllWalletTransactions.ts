import { inject,injectable } from "tsyringe";
import { IGetWalletTransactionsUseCase } from "../../entities/useCaseInterfaces/transactions/IGetAllTransactionUseCase";
import { IWalletRepository } from "../../entities/repositoryInterfaces/wallet/IWalletRepositoryInterface";
import { IWalletTransactionEntity } from "../../entities/models/transaction.entity";
import { IWalletTransactionRepository } from "../../entities/repositoryInterfaces/wallet-transaction/IWalletTransactionRepository";
import { CustomError } from "../../entities/utils/custom.error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../shared/constants";

@injectable()
export class GetWalletTransactionsUseCase implements IGetWalletTransactionsUseCase{
    constructor(
        @inject("IWalletRepository") private _walletRepository:IWalletRepository,
        @inject("IWalletTransactionRepository") private _transactionRepository:IWalletTransactionRepository
    ){}
    async execute(userId: string, page: number, limit: number): Promise<{ transactions: IWalletTransactionEntity[]; total: number; currentPage: number; }> {
        const skip = (page - 1) * limit;
        const wallet =  await this._walletRepository.findWalletByUserId(userId);
        if(!wallet){
            throw new CustomError(
                ERROR_MESSAGES.WALLET_NOT_FOUND,
                HTTP_STATUS.BAD_REQUEST
            )
        }
        const {transactions,total} = await this._transactionRepository.findTransactionsByWalletId(String(wallet._id),skip,limit);
        return {
            transactions,
            total,
            currentPage:page
        }
    }

}