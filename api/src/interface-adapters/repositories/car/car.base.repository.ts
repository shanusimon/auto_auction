import { ICarEntity } from "../../../entities/models/car.entity";
import { ICarBaseRepository } from "../../../entities/repositoryInterfaces/car/ICarBaseRepository";
import { CreateCarDTO } from "../../../shared/dtos/car.dto";
import { CarModel } from "../../../frameworks/database/models/car.model";

export class CarBaseRepository implements ICarBaseRepository {
  constructor() {}
  async count(filter: any): Promise<number> {
    return await CarModel.countDocuments(filter).exec();
  }
  async create(data: CreateCarDTO): Promise<ICarEntity> {
    const car = await CarModel.create(data);
    return car;
  }
  async find(filter: any, skip: number, limit: number): Promise<ICarEntity[]> {
    return await CarModel.find(filter).skip(skip).limit(limit).lean().exec();
  }
  async findById(carId: string): Promise<ICarEntity | null> {
    return await CarModel.findById(carId).lean().exec();
  }

  async delete(id: string): Promise<boolean> {
    const result = await CarModel.findByIdAndDelete(id).exec();
    return result !== null;
  }
  async update(
    id: string,
    updateData: Partial<ICarEntity>
  ): Promise<ICarEntity | null> {
    return await CarModel.findByIdAndUpdate(id, updateData, {
      new: true,
    })
      .lean()
      .exec();
  }
}
