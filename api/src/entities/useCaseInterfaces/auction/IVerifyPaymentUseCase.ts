import { IAuctionWonEntity } from "../../models/auction.won.entity";

export interface IVerifyPaymentUseCase{
    execute(userId:string,sessionId:string):Promise<IAuctionWonEntity>
}