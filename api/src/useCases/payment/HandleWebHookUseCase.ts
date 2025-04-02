import Stripe from "stripe";
import { IWebHookUseCase } from "../../entities/useCaseInterfaces/payment/IWebHookUseCase";
import { config } from "../../shared/config";
import { inject, injectable } from "tsyringe";
import { CustomError } from "../../entities/utils/custom.error";
import { HTTP_STATUS } from "../../shared/constants";
import { IPaymentService } from "../../entities/services/IStripeService";


@injectable()
export class WebHookUseCase implements IWebHookUseCase{
    private stripe:Stripe;
    private endpointSecret:string;
    
    constructor(
        @inject("IPaymentService") private stripeService:IPaymentService
    ){
        this.stripe = new Stripe(config.stripe.STRIPE_SECRET_KEY || "",{
            apiVersion:"2025-02-24.acacia"
        });
        this.endpointSecret = config.stripe.STRIPE_WEBHOOK_SECRET || ""
    }
    async execute(sig: string, body: any): Promise<void> {
        let event :Stripe.Event;

        try {
            const payload = Buffer.isBuffer(body) ? body.toString() : body;

            event = this.stripe.webhooks.constructEvent(
                payload,
                sig,
                this.endpointSecret
            )
        } catch (error) {
            console.error("Webhook signature verification failed:", error);
            throw new CustomError(
              "Invalid webhook signature",
              HTTP_STATUS.BAD_REQUEST)
        }
        await this.stripeService.handleWebHookEvent(event)
    }
}