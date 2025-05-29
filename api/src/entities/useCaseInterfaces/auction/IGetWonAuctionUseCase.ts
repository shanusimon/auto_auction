import { IAuctionWonEntity } from "../../models/auction.won.entity";

export interface IGetWonAuctionUseCase{
    execute(userId:string):Promise<IAuctionWonEntity[] | []>;
}