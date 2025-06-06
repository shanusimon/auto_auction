import { IAuctionWonEntity } from "../../../entities/models/auction.won.entity";
import { AuctionWonRepositoryInterface } from "../../../entities/repositoryInterfaces/auctionwon/IAuctionWonRepositoryInterface";
import { AuctionWonModel } from "../../../frameworks/database/models/auction.won.model";

export class AuctionWonRepository implements AuctionWonRepositoryInterface {
  constructor() {}
  async create(data: IAuctionWonEntity): Promise<IAuctionWonEntity> {
    return await AuctionWonModel.create(data);
  }
  async findByCarId(carId: string): Promise<IAuctionWonEntity | null> {
    return await AuctionWonModel.findOne({ carId });
  }
  async findAuctionsByWinnerId(
    winnerId: string
  ): Promise<IAuctionWonEntity[] | []> {
    const auctionWon = await AuctionWonModel.find({ winnerId })
      .populate(
        "carId",
        "make model year mileage location description images auctionEndTime highestBid exteriorColor interiorColor fuel transmission bodyType title"
      )
      .populate("sellerId", "name email phone profileImage");
    return auctionWon;
  }
  async findById(auctionId: string): Promise<IAuctionWonEntity | null> {
    return await AuctionWonModel.findById(auctionId)
      .populate("carId", "make model year")
      .populate("sellerId", "name email phone profileImage");
  }
async updatePaymentStatus(
  auctionId: string,
  paymentStatus: string
): Promise<IAuctionWonEntity | null> {
  return await AuctionWonModel.findByIdAndUpdate(
    auctionId,
    { paymentStatus },
    { new: true }
  ).populate('carId', 'make model year'); 
}
  async updatePaymentIntentId(
    auctionId: string,
    paymentIntendId: string
  ): Promise<IAuctionWonEntity> {
    const updated = await AuctionWonModel.findByIdAndUpdate(
      auctionId,
      { paymentIntentId: paymentIntendId },
      { new: true }
    );

    if (!updated) {
      throw new Error("Auction not found");
    }

    return updated;
  }
  async updateStripeSessionId(auctionId: string, stripeSessionId: string): Promise<void> {
       await AuctionWonModel.findByIdAndUpdate(auctionId,{stripeSessionId},{new:true})
  }
  async update(auctionId: string, updates: Partial<IAuctionWonEntity>): Promise<IAuctionWonEntity | null> {
    const updated = await AuctionWonModel.findByIdAndUpdate(
      auctionId,
      { $set: updates },
      { new: true }
    );
    return updated;
  }
async findByIdWithoutCarPopulation(auctionId: string): Promise<IAuctionWonEntity | null> {
    return await AuctionWonModel.findById(auctionId)
      .populate("sellerId", "name email phone profileImage") 
      .exec();
  }
}
