import { ObjectId } from "mongoose";
import { IBidEntity } from "../../../entities/models/bid.entity";
import { IBidRepository } from "../../../entities/repositoryInterfaces/bid/IBidRepository";
import { BidModel } from "../../../frameworks/database/models/bid.model";
import { CreateBidDTO } from "../../../shared/dtos/bid.dto";

export class BidRepository implements IBidRepository {
  constructor() {}
  async findById(id: string): Promise<IBidEntity | null> {
    return BidModel.findById(id);
  }
  async delete(id: string): Promise<void> {
    await BidModel.findByIdAndDelete(id);
  }
  async create(data: CreateBidDTO): Promise<IBidEntity> {
    return await BidModel.create(data);
  }
  async findHighestBidByCarAndUser(
    carId: string,
    userId: string
  ): Promise<IBidEntity | null> {
    return await BidModel.findOne({
      carId,
      userId,
      status: "active",
    })
      .sort({ amount: -1 })
      .lean();
  }
  async updateStatus(id: string | ObjectId, status: string): Promise<void> {
    await BidModel.findByIdAndUpdate(id, { status });
  }

  async findAllByCarId(carId: string): Promise<IBidEntity[]> {
    const data = await BidModel.find({ carId })
      .populate("userId", "name profileImage")
      .lean();

    return data.map(
      (bid): IBidEntity => ({
        _id: bid._id.toString(),
        carId: bid.carId,
        userId: bid.userId,
        amount: bid.amount,
        depositHeld: bid.depositHeld,
        timestamp: bid.timestamp,
        status: bid.status,
      })
    );
  }

  async findByUserId(userId: string): Promise<any> {
    const data = await BidModel.find({ userId }).populate(
      "carId",
      "make model year mileage location description images auctionEndTime highestBid exteriorColor interiorColor fuel transmission bodyType title"
    );

    return data;
  }
  async countBidsForSeller(userId: string): Promise<number> {
    const bidCount = await BidModel.countDocuments({ userId });
    return bidCount;
  }
  async countBidsForCar(carId: string): Promise<number> {
    const bidsCount = await BidModel.countDocuments({ carId });
    return bidsCount;
  }
  async findTopBidByCarId(carId: string): Promise<IBidEntity | null> {
    const bid = await BidModel.findOne({ carId })
      .sort({ amount: -1 })
      .limit(1)
      .exec();
    return bid;
  }
}
