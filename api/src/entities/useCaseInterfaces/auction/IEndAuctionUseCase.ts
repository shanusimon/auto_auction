import { IAuctionWonEntity } from "../../models/auction.won.entity";

export interface IEndAuctionUseCase {
    execute(carId:string):Promise<IAuctionWonEntity | null>
}