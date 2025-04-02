import { IWalletTransactionEntity } from "../../models/transaction.entity";

export interface IGetWalletTransactionsUseCase {
    execute(userId: string, page: number, limit: number): Promise<{
        transactions: IWalletTransactionEntity[];
        total: number;
        currentPage: number;
    }>;
}