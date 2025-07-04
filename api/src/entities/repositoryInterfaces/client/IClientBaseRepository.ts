import { IClientEntity } from "../../models/client.entity";

export interface IClientBaseRepository {
  findById(id: any): Promise<IClientEntity | null>;
  find(
    filter: any,
    skip: number,
    limit: number
  ): Promise<{ users: IClientEntity[] | []; total: number }>;
  save(data: Partial<IClientEntity>): Promise<IClientEntity>;
  findCount(): Promise<Number>;
}
