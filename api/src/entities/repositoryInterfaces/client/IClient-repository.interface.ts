import { ClientProfileResponse } from "../../../shared/dtos/user.dto";
import { IClientEntity } from "../../models/client.entity";

export interface IClientRepository{
    save(data:Partial<IClientEntity>):Promise<IClientEntity>;
    findByEmail(email:string):Promise<IClientEntity | null>;
    findById(id:any):Promise<IClientEntity | null>;
    find(
        filter: any,
        skip: number,
        limit: number
    ): Promise<{users: IClientEntity[] | []; total: number}>;
    findByIdAndUpdateStatus(id:string):Promise<void>;
    findAndUpdateByEmail(email:string,updates:Partial<IClientEntity>):Promise<IClientEntity | null>;
    updateProfileById(id:string,data:Partial<IClientEntity>):Promise<ClientProfileResponse>;
    findByIdAndUpdatePassword(id:string,hashedPassword:string):Promise<void>;
    findBySearchTerm(searchTerm:string):Promise<String[]>;
    updateFcmToken(id:string,fcmToken:string):Promise<void>;
    revokeFcmToken(id:string):Promise<void>
}