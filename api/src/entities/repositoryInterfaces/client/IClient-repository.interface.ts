import { IClientEntity } from "../../models/client.entity";

export interface IClientRepository{
    save(data:Partial<IClientEntity>):Promise<IClientEntity>;
    findByEmail(email:string):Promise<IClientEntity | null>;
    findById(id:any):Promise<IClientEntity | null>;
    find(
        filter: any,
        skip: number,
        limit: number
    ): Promise<{users: IClientEntity[] | []; total: number}>
    findByIdAndUpdateStatus(id:string):Promise<void>
}