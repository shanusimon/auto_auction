import { injectable } from "tsyringe";
import { IClientEntity } from "../../../entities/models/client.entity";
import { ClientModel } from "../../../frameworks/database/models/client.model";;
import { IClientRepository } from "../../../entities/repositoryInterfaces/client/IClient-repository.interface";
import { ClientProfileResponse } from "../../../shared/dtos/user.dto";

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
    async findAndUpdateByEmail(email: string, updates: Partial<IClientEntity>): Promise<IClientEntity| null> {
        const client = await ClientModel.findOneAndUpdate({email},{$set:updates},{new:true}).lean()
            if(!client) return null;
    
            return client as IClientEntity
    }
    async updateProfileById(id: string, data: Partial<IClientEntity>): Promise<ClientProfileResponse> {
        const updateProfile = await ClientModel.findByIdAndUpdate(
            id,
            {$set:data},
            {
                new:true
            }
        )
        .select('name phone profileImage bio email joinedAt role walletBalance')
        .exec()

        if(!updateProfile){
            throw new Error("Profile not found");
        }

        return updateProfile as ClientProfileResponse
    }
    async findByIdAndUpdatePassword(id: string, hashedPassword: string): Promise<void> {
        await ClientModel.findByIdAndUpdate(id,{password:hashedPassword})
    }
}