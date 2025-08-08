export interface IBaseRepository<T> {
  find(filter: any): Promise<T[]>;
  findAll(
    filter: any,
    skip: number,
    limit: number
  ): Promise<{ items: T[]; total: number }>;
  findOne(filter: any): Promise<T | null>;
  save(data: Partial<T>): Promise<T>;
  delete(filter: any): Promise<T | null>;
  deleteAll(filter: any): Promise<void>;
  countDocuments(filter: any): Promise<number>;
}
