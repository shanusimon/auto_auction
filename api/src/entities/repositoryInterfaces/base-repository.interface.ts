import { FilterQuery } from "mongoose";

export interface IBaseRepository<T> {
  find(filter: FilterQuery<T>): Promise<T[]>;
  findAll(
    filter: FilterQuery<T>,
    skip: number,
    limit: number
  ): Promise<{ items: T[]; total: number }>;
  findOne(filter: FilterQuery<T>): Promise<T | null>;
  save(data: Partial<T>): Promise<T>;
  delete(filter: FilterQuery<T>): Promise<T | null>;
  deleteAll(filter: FilterQuery<T>): Promise<void>;
  countDocuments(filter: FilterQuery<T>): Promise<number>;
}
