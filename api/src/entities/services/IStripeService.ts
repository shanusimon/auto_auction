import Stripe from "stripe"

export interface IPaymentService{
    createPaymentIntent(
        amount:number,
        currency:string,
         metadata:{type:string;auctionId?:string;userId?:string}
    ):Promise<{
        paymentIntent:string,
        clientSecret:string
    }>

    createCheckOutSession(
    paymentIntentId: string,
    successUrl: string,
    cancelUrl: string,
    auctionId: string,
    userId:string
  ): Promise<{ sessionId: string }>
  getCheckOutSession(sessionId:string):Promise<Stripe.Checkout.Session>
  getPaymentIntent(paymentIntentId: string): Promise<Stripe.PaymentIntent>;

  getCharge(chargeId: string): Promise<Stripe.Charge>;

}