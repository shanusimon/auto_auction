import { inject } from "tsyringe";
import { IClientBaseRepository } from "../../../entities/repositoryInterfaces/client/IClientBaseRepository";
import { IClientEntity } from "../../../entities/models/client.entity";
import { ClientModel } from "../../../frameworks/database/models/client.model";

export class ClientBaseRepository implements IClientBaseRepository {
  async findCount(): Promise<Number> {
    return await ClientModel.countDocuments();
  }
  async find(
    filter: any,
    skip: number,
    limit: number
  ): Promise<{ users: IClientEntity[] | []; total: number }> {
    const users = await ClientModel.find({ role: "user", ...filter })
      .skip(skip)
      .limit(limit);
    return { users, total: users.length };
  }
  async save(data: Partial<IClientEntity>): Promise<IClientEntity> {
    return await ClientModel.create(data);
  }
  async findById(id: any): Promise<IClientEntity | null> {
    const client = await ClientModel.findById(id).lean();
    if (!client) return null;

    return {
      ...client,
      id: client._id.toString(),
    } as IClientEntity;
  }
}
