import { injectable } from "tsyringe";
import { IClientEntity } from "../../../entities/models/client.entity";
import { ClientModel } from "../../../frameworks/database/models/client.model";;
import { IClientRepository } from "../../../entities/useCaseInterfaces/client/client-repository.interface";

@injectable()
export class ClientRepository implements IClientRepository{
    async save(data: Partial<IClientEntity>): Promise<IClientEntity> {
        return await ClientModel.create(data)
    }
    async findByEmail(email: string): Promise<IClientEntity | null> {
        const client = await ClientModel.findOne({email}).lean();
        if(!client) return null;

        return {
            ...client,
            id:client._id.toString()
        }as IClientEntity
    }

    async findById(id: any): Promise<IClientEntity | null> {
        const  client = await ClientModel.findById(id).lean();
        if(!client) return null;

        return {
            ...client,
            id:client._id.toString(),
        }as IClientEntity;
    }
}