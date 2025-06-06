import Stripe from "stripe";
import { IWebHookUseCase } from "../../entities/useCaseInterfaces/payment/IWebHookUseCase";
import { config } from "../../shared/config";
import { inject, injectable } from "tsyringe";
import { CustomError } from "../../entities/utils/custom.error";
import { HTTP_STATUS } from "../../shared/constants";
import { AuctionWonRepositoryInterface } from "../../entities/repositoryInterfaces/auctionwon/IAuctionWonRepositoryInterface";
import { IWalletTransactionRepository } from "../../entities/repositoryInterfaces/wallet-transaction/IWalletTransactionRepository";
import { IWalletRepository } from "../../entities/repositoryInterfaces/wallet/IWalletRepositoryInterface";
import { IAdminWalletRepository } from "../../entities/repositoryInterfaces/adminWallet/IAdminWalletRepository";
import { IClientRepository } from "../../entities/repositoryInterfaces/client/IClient-repository.interface";
import { IBidRepository } from "../../entities/repositoryInterfaces/bid/bidRepository";

@injectable()
export class WebHookUseCase implements IWebHookUseCase {
  private stripe: Stripe;
  private endpointSecret: string;

  constructor(
    @inject("AuctionWonRepositoryInterface")
    private auctionWonRepository: AuctionWonRepositoryInterface,
    @inject("IWalletTransactionRepository")
    private walletTransactionRepository: IWalletTransactionRepository,
    @inject("IWalletRepository") private walletRepository: IWalletRepository,
    @inject("IAdminWalletRepository")
    private adminWalletRepository: IAdminWalletRepository,
    @inject("IClientRepository") private clientRepository: IClientRepository,
    @inject("IBidRepository") private bidRepository: IBidRepository
  ) {
    this.stripe = new Stripe(config.stripe.STRIPE_SECRET_KEY || "", {
       apiVersion: "2024-06-20",
    });
    this.endpointSecret = config.stripe.STRIPE_WEBHOOK_SECRET || "";
  }

  async execute(sig: string, body: any): Promise<void> {
    let event: Stripe.Event;

    try {
      const payload = Buffer.isBuffer(body) ? body.toString() : body;
      event = this.stripe.webhooks.constructEvent(
        payload,
        sig,
        this.endpointSecret
      );
    } catch (error) {
      throw new CustomError(
        "Invalid webhook signature",
        HTTP_STATUS.BAD_REQUEST
      );
    }

    switch (event.type) {
      case "checkout.session.completed":
        if (event.data.object.object === "checkout.session") {
          const session = event.data.object as Stripe.Checkout.Session;
          const paymentType = session.metadata?.type || "unknown";
          console.log("this is session",session);

          if (paymentType === "car_payment") {
            await this.handleAuctionPayment(session);
          }
        }
        break;

      case "payment_intent.created":
        if (event.data.object.object === "payment_intent") {
          const paymentIntent = event.data.object as Stripe.PaymentIntent;
          console.log(`Payment intent created: ${paymentIntent.id}`);
        }
        break;

      case "payment_intent.processing":
        if (event.data.object.object === "payment_intent") {
          const paymentIntent = event.data.object as Stripe.PaymentIntent;
          const paymentType = paymentIntent.metadata?.type || "unknown";
          if (paymentType === "wallet_fund") {
            await this.handleWalletFunding(paymentIntent, "processing");
          }
        }
        break;

      case "payment_intent.succeeded":
        if (event.data.object.object === "payment_intent") {
          const paymentIntent = event.data.object as Stripe.PaymentIntent;
          const paymentType = paymentIntent.metadata?.type || "unknown";
          if (paymentType === "wallet_fund") {
            await this.handleWalletFunding(paymentIntent, "completed");
          }
        }
        break;

      case "payment_intent.payment_failed":
        if (event.data.object.object === "payment_intent") {
          const paymentIntent = event.data.object as Stripe.PaymentIntent;
          const paymentType = paymentIntent.metadata?.type || "unknown";
          if (paymentType === "wallet_fund") {
            await this.handleWalletFunding(paymentIntent, "failed");
          }
        }
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
  }

  private async handleAuctionPayment(
    session: Stripe.Checkout.Session
  ): Promise<void> {
    const auctionId = session.metadata?.auctionId;
    const userId = session.metadata?.userId;

    if (!auctionId || !userId) {
      throw new CustomError(
        "Missing auctionId or userId in session metadata",
        HTTP_STATUS.BAD_REQUEST
      );
    }

    const user = await this.clientRepository.findById(userId);
    if (!user) {
      throw new CustomError(
        `User not found with ID: ${userId}`,
        HTTP_STATUS.NOT_FOUND
      );
    }

    const auctionWon = await this.auctionWonRepository.findById(auctionId);
    if (!auctionWon) {
      throw new CustomError(
        `Auction record not found with ID: ${auctionId}`,
        HTTP_STATUS.NOT_FOUND
      );
    }

    if (auctionWon.winnerId?.toString() !== userId) {
      throw new CustomError(
        "Unauthorized auction access attempt",
        HTTP_STATUS.FORBIDDEN
      );
    }

    if (session.status === "complete" && session.payment_status === "paid") {
      if (auctionWon.paymentStatus === "succeeded") {
        console.log(`Payment already succeeded for auctionId: ${auctionId}`);
        return;
      }

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

      // Store receipt URL
      if (session.payment_intent) {
        const paymentIntent = await this.stripe.paymentIntents.retrieve(
          session.payment_intent as string
        );
        if (paymentIntent.latest_charge) {
          const charge = await this.stripe.charges.retrieve(
            paymentIntent.latest_charge as string
          );
          if (charge.receipt_url) {
            await this.auctionWonRepository.update(auctionId, {
              receiptUrl: charge.receipt_url,
            });
          }
        }
      }

      let adminWallet = await this.adminWalletRepository.findSingle();
      const commissionAmount = updatedAuctionWon.platformCharge;
      const carId =auctionWon.carId;
      console.log("This is the carId",carId,auctionWon)
      if (!adminWallet) {
        const newAdminWallet = {
          balanceAmount: commissionAmount,
          transaction: [
            {
              transactionId: session.payment_intent?.toString() || session.id,
              userName: user.name || "Unknown",
              auctionId: updatedAuctionWon._id!.toString(),
              carId: carId,
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
          carId: carId,
          amountReceived: updatedAuctionWon.amount,
          commissionAmount,
          timeStamp: new Date(),
        });
        await this.adminWalletRepository.update(adminWallet._id!.toString(), {
          balanceAmount: adminWallet.balanceAmount,
          transaction: adminWallet.transaction,
        });
      }

      const bid = await this.bidRepository.findById(
        auctionWon.bidId.toString()
      );
      const wallet = await this.walletRepository.findWalletByUserId(userId);
      if (bid && wallet) {
        wallet.availableBalance += bid.depositHeld;
        wallet.reservedBalance -= bid.depositHeld;

        await this.walletRepository.update(wallet._id, {
          availableBalance: wallet.availableBalance,
          reservedBalance: wallet.reservedBalance,
        });

         await this.walletTransactionRepository.create({
          walletId:wallet._id,
          type:'deposit_release',
          amount:bid.depositHeld,
          status:'completed'
         })
      }

      console.log(`Auction payment completed for auctionId: ${auctionId}`);
    }
  }

  private async handleWalletFunding(
    paymentIntent: Stripe.PaymentIntent,
    status: string
  ): Promise<void> {
    const paymentIntentId = paymentIntent.id;
    const userId = paymentIntent.metadata?.userId;

    if (!userId) {
      throw new CustomError(
        `Missing userId in payment intent metadata`,
        HTTP_STATUS.BAD_REQUEST
      );
    }

    const transaction =
      await this.walletTransactionRepository.findByStripePaymentId(
        paymentIntentId
      );
    if (!transaction) {
      throw new CustomError(
        `Transaction not found for payment intent: ${paymentIntentId}`,
        HTTP_STATUS.NOT_FOUND
      );
    }

    if (transaction.status === status) {
      console.log(
        `Transaction already in state ${status} for payment intent: ${paymentIntentId}`
      );
      return;
    }

    await this.walletTransactionRepository.findByStripeIdAndUpdateStatus(
      paymentIntentId,
      status
    );

    if (status === "completed") {
      let receiptUrl: string | null = null;
      if (paymentIntent.latest_charge) {
        const charge = await this.stripe.charges.retrieve(
          paymentIntent.latest_charge as string
        );
        receiptUrl = charge.receipt_url;
      }

      if (receiptUrl) {
        await this.walletTransactionRepository.update(transaction._id, {
          receiptUrl,
        });
      }

      await this.walletRepository.addBalance(
        transaction.walletId,
        paymentIntent.amount_received / 100
      );
    }

    console.log(
      `Wallet funding status updated to ${status} for payment intent: ${paymentIntentId}`
    );
  }
}
