import { inject, injectable } from "tsyringe";
import { IAddMoneyToWalletUseCase } from "../../entities/useCaseInterfaces/wallet/IAddMoneyToWalletUseCase";
import { IPaymentService } from "../../entities/services/IStripeService";
import { IWalletRepository } from "../../entities/repositoryInterfaces/wallet/IWalletRepositoryInterface";
import { IWalletTransactionRepository } from "../../entities/repositoryInterfaces/wallet-transaction/IWalletTransactionRepository";

@injectable()
export class AddMoneyToWalletUseCase implements IAddMoneyToWalletUseCase{
    constructor(
        @inject("IPaymentService") private _stripeService:IPaymentService,
        @inject("IWalletRepository") private _walletRepository:IWalletRepository,
        @inject("IWalletTransactionRepository") private _walletTransaction:IWalletTransactionRepository
    ){}
    async execute(userId: string, amount: number): Promise<{ clientSecret: string; }> {
        
        const wallet = await this._walletRepository.findWalletByUserId(userId);
        const paymentIntent = await this._stripeService.createPaymentIntent(amount,"usd",{ type: "wallet_fund", userId });
        const amountInDollars = amount / 100;
        await this._walletTransaction.create({
            walletId:wallet?._id,
            type:"deposit",
            amount:amountInDollars,
            status:"pending",
            stripePaymentId:paymentIntent.paymentIntent,
        });

        return {clientSecret:paymentIntent.clientSecret}
        
    }
}