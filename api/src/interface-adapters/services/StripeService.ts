import Stripe from "stripe";
import { IPaymentService } from "../../entities/services/IStripeService";
import { injectable } from "tsyringe";
import { config } from "../../shared/config";
import { CustomError } from "../../entities/utils/custom.error";
import { HTTP_STATUS } from "../../shared/constants";

@injectable()
export class StripeService implements IPaymentService {
  private stripe: Stripe;
  private apiKey: string;

  constructor() {
    this.apiKey = config.stripe.STRIPE_SECRET_KEY || "";
    console.log('StripeService: API Key:', this.apiKey?.substring(0, 10) + '...');
    if (!this.apiKey) {
      throw new CustomError(
        'Stripe API key is missing or undefined',
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      );
    }
    this.stripe = new Stripe(this.apiKey, {
     apiVersion: "2024-06-20",
    });
  }

  async createPaymentIntent(
    amount: number,
    currency: string,
    metadata: { type: string; auctionId?: string; userId?: string } = { type: "wallet_fund" }
  ): Promise<{ paymentIntent: string; clientSecret: string }> {
    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount,
        currency,
        automatic_payment_methods: { enabled: true },
        metadata,
      });
      return {
        paymentIntent: paymentIntent.id!,
        clientSecret: paymentIntent.client_secret!,
      };
    } catch (error) {
      console.error("Error creating payment intent:", error);
      throw new CustomError(
        "Failed To Create Payment Intent",
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      );
    }
  }

  async createCheckOutSession(
    paymentIntentId: string,
    successUrl: string,
    cancelUrl: string,
    auctionId: string,
    userId:string
  ): Promise<{ sessionId: string }> {
    try {
      const paymentIntent = await this.stripe.paymentIntents.retrieve(paymentIntentId);
      if (!paymentIntent) {
        throw new CustomError("Invalid PaymentIntent", HTTP_STATUS.BAD_REQUEST);
      }

      const session = await this.stripe.checkout.sessions.create({
        mode: "payment",
        success_url: successUrl,
        cancel_url: cancelUrl,
        line_items: [
          {
            price_data: {
              currency: paymentIntent.currency,
              product_data: {
                name: `Auction Payment for ID: ${auctionId}`,
              },
              unit_amount: paymentIntent.amount,
            },
            quantity: 1,
          },
        ],
        metadata: { auctionId, type: "car_payment",userId },
      });

      return { sessionId: session.id };
    } catch (error) {
      console.error(`Error creating Checkout session for auctionId: ${auctionId}`, error);
      throw new CustomError("Failed to create checkout session", HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }

  async getCheckOutSession(sessionId: string): Promise<Stripe.Checkout.Session> {
    try {
      const session = await this.stripe.checkout.sessions.retrieve(sessionId);
      return session;
    } catch (error) {
      console.error(`Error retrieving Checkout session with ID: ${sessionId}`, error);
      throw new CustomError("Failed to retrieve checkout session", HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  }
  async getPaymentIntent(paymentIntentId: string): Promise<Stripe.PaymentIntent> {
    try {
      const paymentIntent = await this.stripe.paymentIntents.retrieve(paymentIntentId);
      return paymentIntent;
    } catch (error) {
      console.error(`Error retrieving PaymentIntent with ID: ${paymentIntentId}`, error);
      throw new CustomError("Failed to retrieve payment intent", HTTP_STATUS.BAD_REQUEST);
    }
  }

  async getCharge(chargeId: string): Promise<Stripe.Charge> {
    try {
      const charge = await this.stripe.charges.retrieve(chargeId);
      return charge;
    } catch (error) {
      console.error(`Error retrieving Charge with ID: ${chargeId}`, error);
      throw new CustomError("Failed to retrieve charge", HTTP_STATUS.BAD_REQUEST);
    }
  }
}