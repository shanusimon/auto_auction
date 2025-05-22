import { SellerDTO } from "../../../shared/dtos/user.dto";
import { ISellerEntity } from "../../models/seller.entity";


export interface ISellerRepository {
    create(seller:SellerDTO):Promise<ISellerEntity>
    findByUserId(userId:string):Promise<ISellerEntity | null>
    find(
        filter:any,
        skip:number,
        limit:number
    ):Promise<{sellers:ISellerEntity[] | [];total:number}>
    count(filter:any):Promise<number>
    update(seller:ISellerEntity):Promise<ISellerEntity | null>
    findOne(_id:string):Promise<ISellerEntity | null>
    findSellerDetails(_id:string):Promise<ISellerEntity | null>
    findByIdAndUpdateStatus(id:string):Promise<void>
    delete(id:string):Promise<void>
}