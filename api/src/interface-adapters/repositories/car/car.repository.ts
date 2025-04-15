import { ICarEntity } from "../../../entities/models/car.entity";
import { ICarRepository } from "../../../entities/repositoryInterfaces/car/carRepository";
import { CarModel } from "../../../frameworks/database/models/car.model";
import { carDTO } from "../../../shared/dtos/car.dto";

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
}
