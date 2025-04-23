import { query } from "express";
import { ICarEntity } from "../../../entities/models/car.entity";
import { ICarRepository } from "../../../entities/repositoryInterfaces/car/carRepository";
import { CarModel } from "../../../frameworks/database/models/car.model";
import { carDTO, ICarFilter } from "../../../shared/dtos/car.dto";

export class CarRepository implements ICarRepository {
    async create(data: carDTO): Promise<ICarEntity> {
        const car = await CarModel.create(data);
        return car;
    }

    async find(filter: any, skip: number, limit: number): Promise<ICarEntity[]> {
        return await CarModel.find(filter)
            .skip(skip)
            .limit(limit)
            .lean()
            .exec();
    }

    async count(filter: any): Promise<number> {
        return await CarModel.countDocuments(filter).exec();
    }
    async findById(carId: string): Promise<ICarEntity | null> {
        return await CarModel.findById(carId);
    }
    async findByIdAndUpdate(id: string, data: ICarEntity): Promise<void> {
        await CarModel.findByIdAndUpdate(id,data);
    }
    async getFilteredCars(filter: ICarFilter, sort: string, page: number, limit: number): Promise<ICarEntity[]> {
        const baseQuery = {
            approvalStatus: 'approved',
            auctionEndTime: { $gt: new Date() }
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
        
        return query.lean().exec();
    }
}
