import { Model, FilterQuery } from "mongoose";
import { IBaseRepository } from "../../entities/repositoryInterfaces/base-repository.interface";

export abstract class BaseRepository<T> implements IBaseRepository<T> {
  constructor(protected readonly model: Model<T>) {}

  async find(filter: FilterQuery<T> = {}): Promise<T[]> {
    return this.model.find(filter).lean() as Promise<T[]>;
  }

  async findAll(
    filter: FilterQuery<T> = {},
    skip = 0,
    limit = 10
  ): Promise<{ items: T[]; total: number }> {
    const [items, total] = await Promise.all([
      this.model.find(filter).skip(skip).limit(limit).lean() as Promise<T[]>,
      this.model.countDocuments(filter),
    ]);
    return { items, total };
  }

  async findOne(filter: FilterQuery<T>): Promise<T | null> {
    return this.model.findOne(filter).lean() as Promise<T | null>;
  }

  async save(data: Partial<T>): Promise<T> {
    return this.model.create(data);
  }

  async delete(filter: FilterQuery<T>): Promise<T | null> {
    return this.model.findOneAndDelete(filter).lean() as Promise<T | null>;
  }

  async deleteAll(filter: FilterQuery<T>): Promise<void> {
    await this.model.deleteMany(filter);
  }

  async countDocuments(filter: FilterQuery<T>): Promise<number> {
    return this.model.countDocuments(filter);
  }
}
