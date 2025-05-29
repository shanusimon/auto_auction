import { ICreateCheckOutSessionUseCase } from "../../entities/useCaseInterfaces/auction/ICreateCheckOutSessionUseCase";
import { inject, injectable } from "tsyringe";
import { AuctionWonRepositoryInterface } from "../../entities/repositoryInterfaces/auctionwon/IAuctionWonRepositoryInterface";
import { CustomError } from "../../entities/utils/custom.error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../shared/constants";
import { IPaymentService } from "../../entities/services/IStripeService";
import { config } from "../../shared/config";

@injectable()
export class CreateCheckOutSessionUseCase implements ICreateCheckOutSessionUseCase {
  constructor(
    @inject("AuctionWonRepositoryInterface") private auctionWonRepository: AuctionWonRepositoryInterface,
    @inject("IPaymentService") private stripeService: IPaymentService
  ) {}

  async execute(auctionId: string, userId: string): Promise<string> {
    const auctionWon = await this.auctionWonRepository.findById(auctionId);
    if (!auctionWon || auctionWon.winnerId?.toString() !== userId) {
      throw new CustomError(
        ERROR_MESSAGES.UNAUTHORIZED_ACCESS,
        HTTP_STATUS.BAD_REQUEST
      );
    }
    if (auctionWon.paymentStatus === "succeeded") {
      throw new CustomError(
        ERROR_MESSAGES.PAYMENT_DONE,
        HTTP_STATUS.BAD_REQUEST
      );
    }

    const totalAmount = auctionWon.amount + auctionWon.platformCharge;
    if (totalAmount <= 0) {
        throw new CustomError(
          'Invalid amount',
          HTTP_STATUS.BAD_REQUEST
        );
      }
      const { paymentIntent: paymentIntentId } = await this.stripeService.createPaymentIntent(
        totalAmount * 100,
        'usd',
        { type: 'car_payment', auctionId }
      );
      
     await this.auctionWonRepository.updatePaymentIntentId(auctionId ,paymentIntentId)
  
      
    const session = await this.stripeService.createCheckOutSession(
    paymentIntentId,
      `${config.cors.ALLOWED_ORGIN}/user/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      `${config.cors.ALLOWED_ORGIN}/user/payment/cancel`,
      auctionId,
      userId
    );
    
    await this.auctionWonRepository.updateStripeSessionId(auctionId ,session.sessionId)
    
    return session.sessionId
  }
}