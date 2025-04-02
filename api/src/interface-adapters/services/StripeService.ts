import Stripe from "stripe";
import { IPaymentService } from "../../entities/services/IStripeService";
import { inject, injectable } from "tsyringe";
import { config } from "../../shared/config";
import { CustomError } from "../../entities/utils/custom.error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../shared/constants";
import { IWalletTransactionRepository } from "../../entities/repositoryInterfaces/wallet-transaction/IWalletTransactionRepository";
import { IWalletRepository } from "../../entities/repositoryInterfaces/wallet/IWalletRepositoryInterface";

@injectable()
export class StripeService implements IPaymentService {
    private stripe: Stripe;
    private apiKey: string;

    constructor(
        @inject("IWalletTransactionRepository") private transactionRepository: IWalletTransactionRepository,
        @inject("IWalletRepository") private walletRepository: IWalletRepository
    ) {
        this.apiKey = config.stripe.STRIPE_SECRET_KEY || "";
        this.stripe = new Stripe(this.apiKey, {
            apiVersion: "2025-02-24.acacia"
        });
    }

    async createPaymentIntent(amount: number, currency: string): Promise<{ paymentIntent: string; clientSecret: string }> {
        try {
            const paymentIntent = await this.stripe.paymentIntents.create({
                amount,
                currency,
                automatic_payment_methods: { enabled: true }
            });
            console.log("Hello payment:", paymentIntent);
            return {
                paymentIntent: paymentIntent.id!,
                clientSecret: paymentIntent.client_secret!
            };
        } catch (error) {
            console.error("Error creating payment intent:", error);
            throw new CustomError(
                "Failed To Create Payment Intent",
                HTTP_STATUS.INTERNAL_SERVER_ERROR
            );
        }
    }

    async updatePaymentStatus(paymentIntentId: string, status: string): Promise<void> {
        try {
            const transaction = await this.transactionRepository.findByStripePaymentId(paymentIntentId);
            if (!transaction) {
                throw new CustomError(
                    "Transaction not found",
                    HTTP_STATUS.BAD_REQUEST
                );
            }

            if (transaction.status === status) {
                console.log(`Transaction already in state ${status} for payment intent: ${paymentIntentId}`);
                return;
            }


            await this.transactionRepository.findByStripeIdAndUpdateStatus(paymentIntentId, status);

            if (status === "completed") {
                const paymentIntent = await this.stripe.paymentIntents.retrieve(paymentIntentId);
                let receiptUrl: string | null = null;
                if (paymentIntent.latest_charge) {
                    const charge = await this.stripe.charges.retrieve(paymentIntent.latest_charge as string);
                    receiptUrl = charge.receipt_url;
                }

                if (receiptUrl) {
                    await this.transactionRepository.update(transaction._id, { receiptUrl });
                    console.log(`Receipt URL saved for payment intent: ${paymentIntentId}, URL: ${receiptUrl}`);
                } else {
                    console.warn(`No receipt URL found for payment intent: ${paymentIntentId}`);
                }

                await this.walletRepository.addBalance(
                    transaction.walletId,
                    paymentIntent.amount_received / 100
                );
                console.log(`Wallet updated for payment intent: ${paymentIntentId}, amount: $${paymentIntent.amount_received / 100}`);
            }

            console.log(`Payment status updated to ${status} for payment intent: ${paymentIntentId}`);
        } catch (error) {
            console.error(`Error updating payment status to ${status} for ${paymentIntentId}:`, error);
            throw error instanceof CustomError ? error : new CustomError(
                `Failed to update payment status to ${status}`,
                HTTP_STATUS.INTERNAL_SERVER_ERROR
            );
        }
    }

    async handleWebHookEvent(event: Stripe.Event): Promise<void> {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;

        switch (event.type) {
            case "payment_intent.created":
                console.log(`Payment intent created: ${paymentIntent.id}`);
                break;

            case "payment_intent.processing":
                await this.updatePaymentStatus(paymentIntent.id, "processing");
                break;

            case "payment_intent.succeeded":
                await this.updatePaymentStatus(paymentIntent.id, "completed");
                break;

            case "payment_intent.payment_failed":
                await this.updatePaymentStatus(paymentIntent.id, "failed");
                console.log(`Payment failed reason: ${paymentIntent.last_payment_error?.message || "Unknown"}`);
                break;

            default:
                console.log(`Unhandled event type: ${event.type}`);
        }
    }
}