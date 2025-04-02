import Stripe from "stripe"

export interface IPaymentService{
    createPaymentIntent(
        amount:number,
        currency:string
    ):Promise<{
        paymentIntent:string,
        clientSecret:string
    }>
    handleWebHookEvent(event:Stripe.Event):Promise<void>
    updatePaymentStatus(paymentIntentId:string,status:string):Promise<void>
}