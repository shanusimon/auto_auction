import { inject, injectable } from "tsyringe";
import { IAddMoneyToWalletUseCase } from "../../entities/useCaseInterfaces/wallet/IAddMoneyToWalletUseCase";
import { IPaymentService } from "../../entities/services/IStripeService";
import { IWalletRepository } from "../../entities/repositoryInterfaces/wallet/IWalletRepositoryInterface";
import { IWalletTransactionRepository } from "../../entities/repositoryInterfaces/wallet-transaction/IWalletTransactionRepository";

@injectable()
export class AddMoneyToWalletUseCase implements IAddMoneyToWalletUseCase{
    constructor(
        @inject("IPaymentService") private stripeService:IPaymentService,
        @inject("IWalletRepository") private walletRepository:IWalletRepository,
        @inject("IWalletTransactionRepository") private walletTransaction:IWalletTransactionRepository
    ){}
    async execute(userId: string, amount: number): Promise<{ clientSecret: string; }> {
        
        const wallet = await this.walletRepository.findWalletByUserId(userId);
        const paymentIntent = await this.stripeService.createPaymentIntent(amount,"usd",{ type: "wallet_fund", userId });
        const amountInDollars = amount / 100;
        await this.walletTransaction.create({
            walletId:wallet?._id,
            type:"deposit",
            amount:amountInDollars,
            status:"pending",
            stripePaymentId:paymentIntent.paymentIntent,
        });

        return {clientSecret:paymentIntent.clientSecret}
        
    }
}