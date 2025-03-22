import { injectable } from "tsyringe";
import { IClientEntity } from "../../../entities/models/client.entity";
import { ClientModel } from "../../../frameworks/database/models/client.model";;
import { IClientRepository } from "../../../entities/repositoryInterfaces/client/IClient-repository.interface";

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
    async find(
        filter: any,
        skip: number,
        limit: number
    ): Promise<{users: IClientEntity[] | []; total: number}>{
        const users = await ClientModel.find({role:"user",...filter}).skip(skip).limit(limit);
        return {users,total:users.length}
    }
    async findByIdAndUpdateStatus(id: string): Promise<void> {
        const customer = await ClientModel.findById(id);
        console.log("customer id2",customer)
        if(!customer){
            throw new Error("Customer not found")
        }

        const updateStatus = !customer.isBlocked;

        const result = await ClientModel.findByIdAndUpdate(id,{$set:{isBlocked:updateStatus}})

    }

}