import { IAuctionWonEntity } from "../../models/auction.won.entity";

export interface AuctionWonRepositoryInterface {
  create(data: IAuctionWonEntity): Promise<IAuctionWonEntity>;
  findByCarId(carId: string): Promise<IAuctionWonEntity | null>;
  findAuctionsByWinnerId(winnerId: string): Promise<IAuctionWonEntity[] | []>;
  findById(auctionId: string): Promise<IAuctionWonEntity | null>;
  updatePaymentStatus(
    auctionId: string,
    paymentStatus: string
  ): Promise<IAuctionWonEntity | null>;
  updatePaymentIntentId(auctionId:string,paymentIntendId:string):Promise<IAuctionWonEntity>;
  updateStripeSessionId(auctionId:string,stripeSessionId:string):Promise<void>
  update(auctionId: string, updates: Partial<IAuctionWonEntity>): Promise<IAuctionWonEntity | null>
findByIdWithoutCarPopulation(auctionId: string): Promise<IAuctionWonEntity | null>;
}
