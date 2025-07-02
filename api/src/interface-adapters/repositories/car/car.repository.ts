import { ICarEntity } from "../../../entities/models/car.entity";
import { ICarRepository } from "../../../entities/repositoryInterfaces/car/ICarRepository";
import { CarModel } from "../../../frameworks/database/models/car.model";
import { carDTO, ICarFilter } from "../../../shared/dtos/car.dto";

export class CarRepository implements ICarRepository {
  async findByIdAndUpdate(id: string, data: ICarEntity): Promise<void> {
    await CarModel.findByIdAndUpdate(id, data).exec();
  }

  async getFilteredCars(
    filter: ICarFilter,
    sort: string,
    page: number,
    limit: number
  ): Promise<ICarEntity[]> {
    const baseQuery = {
      approvalStatus: "approved",
      auctionEndTime: { $gt: new Date() },
    };

    const queryConditions = { ...baseQuery, ...filter };

    let query = CarModel.find(queryConditions);

    if (sort === "ending-soon") {
      query = query.sort({ auctionEndTime: 1 });
    } else if (sort === "newly-listed") {
      query = query.sort({ auctionEndTime: -1 });
    } else if (sort === "no-reserve") {
      query = query.find({ reservedPrice: null });
    }

    query.skip((page - 1) * limit).limit(limit);

    return await query.lean().exec();
  }

  async findByVehicleNumber(vehicleNumber: string): Promise<ICarEntity | null> {
    return await CarModel.findOne({ vehicleNumber }).lean().exec();
  }

  async findCount(sellerId: string): Promise<number> {
    return await CarModel.countDocuments({ sellerId }).exec();
  }

  async findAllCarsBySellerId(sellerId: string): Promise<ICarEntity[]> {
    return await CarModel.find({ sellerId })
      .populate("highestBidderId", "name")
      .lean()
      .exec();
  }

  async updateRejectionReason(
    carId: string,
    rejectionReason: string
  ): Promise<void> {
    await CarModel.findByIdAndUpdate(carId, { rejectionReason }).exec();
  }

  async findEndedAuction(): Promise<ICarEntity[]> {
    const now = new Date();
    return await CarModel.find({
      approvalStatus: "approved",
      auctionEndTime: { $lte: now },
    })
      .lean()
      .exec();
  }

  async findSoldCars(): Promise<ICarEntity[]> {
    return await CarModel.find({ approvalStatus: "sold" })
      .sort({ auctionEndTime: -1 })
      .lean()
      .exec();
  }

  async findOneAndUpdate(
    query: any,
    update: any,
    options: any = { new: true }
  ): Promise<ICarEntity | null> {
    const updateDoc = Array.isArray(update) ? update : { $set: update };
    const result = await CarModel.findOneAndUpdate(query, updateDoc, {
      new: true,
      ...options,
    })
      .lean()
      .exec();
    return result;
  }
  async auctionAnalytics(): Promise<
    { name: string; value: number; count: number }[]
  > {
    const aggregation = await CarModel.aggregate([
      {
        $group: {
          _id: "$make",
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          name: "$_id",
          count: 1,
          _id: 0,
        },
      },
    ]);
    const totalAuctions = aggregation.reduce(
      (sum, item) => sum + item.count,
      0
    );
    let result = aggregation.map((item) => ({
      name: item.name || "Unknown",
      count: item.count,
      value:
        totalAuctions > 0
          ? Number(((item.count / totalAuctions) * 100).toFixed(2))
          : 0,
    }));
    const othersThreshold = 5;
    const othersMinCount = 10;
    const mainManufacturers = result.filter(
      (item) => item.value >= othersThreshold || item.count >= othersMinCount
    );
    const others = result.filter(
      (item) => item.value < othersThreshold && item.count < othersMinCount
    );

    if (others.length > 0) {
      const othersAggregate = others.reduce(
        (acc, item) => ({
          name: "Others",
          count: acc.count + item.count,
          value: acc.value + item.value,
        }),
        { name: "Others", count: 0, value: 0 }
      );
      othersAggregate.value = Number(othersAggregate.value.toFixed(2));
      mainManufacturers.push(othersAggregate);
    }

    result = mainManufacturers.sort((a, b) => b.count - a.count).slice(0, 5);

    return result;
  }
}
