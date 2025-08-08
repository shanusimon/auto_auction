// src/application/useCases/auction/VerifyPaymentUseCase.ts
import { IVerifyPaymentUseCase } from "../../entities/useCaseInterfaces/auction/IVerifyPaymentUseCase";
import { inject, injectable } from "tsyringe";
import { AuctionWonRepositoryInterface } from "../../entities/repositoryInterfaces/auctionwon/IAuctionWonRepositoryInterface";
import { IPaymentService } from "../../entities/services/IStripeService";
import { CustomError } from "../../entities/utils/custom.error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../shared/constants";
import { IAuctionWonEntity } from "../../entities/models/auction.won.entity";
import { IAdminWalletRepository } from "../../entities/repositoryInterfaces/adminWallet/IAdminWalletRepository";
import { IAdminWallet } from "../../entities/models/admin.wallet.entity";
import { IClientRepository } from "../../entities/repositoryInterfaces/client/IClient-repository.interface";


@injectable()
export class VerifyPaymentUseCase implements IVerifyPaymentUseCase {
  constructor(
    @inject("AuctionWonRepositoryInterface")
    private auctionWonRepository: AuctionWonRepositoryInterface,
    @inject("IPaymentService")
    private stripeService: IPaymentService,
    @inject("IAdminWalletRepository")
    private adminWalletRepository: IAdminWalletRepository,
    @inject("IClientRepository") private clientRepository: IClientRepository,
  ) {}

  async execute(userId: string, sessionId: string): Promise<IAuctionWonEntity> {
    const session = await this.stripeService.getCheckOutSession(sessionId);
    if (!session) {
      throw new CustomError(ERROR_MESSAGES.WRONG_ID, HTTP_STATUS.BAD_REQUEST);
    }

    if (session.metadata?.type !== "car_payment") {
      throw new CustomError(
        "Invalid payment type for auction verification",
        HTTP_STATUS.BAD_REQUEST
      );
    }

    const user = await this.clientRepository.findById(userId);
    if (!user) {
      throw new CustomError(
        ERROR_MESSAGES.USER_NOT_FOUND,
        HTTP_STATUS.BAD_REQUEST
      );
    }

    const auctionId = session.metadata?.auctionId;
    if (!auctionId) {
      throw new CustomError(
        "Missing auction ID in session metadata",
        HTTP_STATUS.BAD_REQUEST
      );
    }

    const auctionWon = await this.auctionWonRepository.findById(auctionId);
    if (!auctionWon) {
      throw new CustomError("Auction record not found", HTTP_STATUS.NOT_FOUND);
    }

    if (auctionWon.winnerId?.toString() !== userId) {
      throw new CustomError(
        ERROR_MESSAGES.UNAUTHORIZED_ACCESS,
        HTTP_STATUS.BAD_REQUEST
      );
    }

    if (auctionWon.paymentStatus === "succeeded") {
      return auctionWon;
    }

    if (session.status === "complete" && session.payment_status === "paid") {
      const updatedAuctionWon =
        await this.auctionWonRepository.updatePaymentStatus(
          auctionId,
          "succeeded"
        );
      if (!updatedAuctionWon) {
        throw new CustomError(
          "Failed to update auction payment status",
          HTTP_STATUS.INTERNAL_SERVER_ERROR
        );
      }

      // Store receiptUrl if not already set (e.g., by WebHookUseCase)
      if (session.payment_intent && !updatedAuctionWon.receiptUrl) {
        const paymentIntent = await this.stripeService.getPaymentIntent(
          session.payment_intent as string
        );
        if (paymentIntent.latest_charge) {
          const charge = await this.stripeService.getCharge(
            paymentIntent.latest_charge as string
          );
          if (charge.receipt_url) {
            await this.auctionWonRepository.update(auctionId, {
              receiptUrl: charge.receipt_url,
            });
            // Refresh updatedAuctionWon to include receiptUrl
            const refreshedAuctionWon =
              await this.auctionWonRepository.findById(auctionId);
            if (refreshedAuctionWon) {
              updatedAuctionWon.receiptUrl = refreshedAuctionWon.receiptUrl;
            }
          }
        }
      }

      let adminWallet = await this.adminWalletRepository.findSingle();
      const commissionAmount = updatedAuctionWon.platformCharge;

      if (!adminWallet) {
        const newAdminWallet: IAdminWallet = {
          balanceAmount: commissionAmount,
          transaction: [
            {
              transactionId: session.payment_intent?.toString() || session.id,
              userName: user.name || "Unknown",
              auctionId: updatedAuctionWon._id!.toString(),
              carId: auctionWon._id!,
              amountReceived: updatedAuctionWon.amount,
              commissionAmount,
              timeStamp: new Date(),
            },
          ],
        };
        await this.adminWalletRepository.create(newAdminWallet);
      } else {
        adminWallet.balanceAmount += commissionAmount;
        adminWallet.transaction.push({
          transactionId: session.payment_intent?.toString() || session.id,
          userName: user.name || "Unknown",
          auctionId: updatedAuctionWon._id!.toString(),
          carId: updatedAuctionWon.carId.toString(),
          amountReceived: updatedAuctionWon.amount,
          commissionAmount,
          timeStamp: new Date(),
        });
        await this.adminWalletRepository.update(adminWallet._id!.toString(), {
          balanceAmount: adminWallet.balanceAmount,
          transaction: adminWallet.transaction,
        });
      }

      return updatedAuctionWon;
    }

    throw new CustomError("Payment is not completed", HTTP_STATUS.BAD_REQUEST);
  }
}
