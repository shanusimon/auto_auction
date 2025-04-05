import { SellerDTO } from "../../../shared/dtos/user.dto";
import { ISellerEntity } from "../../models/seller.entity";


export interface ISellerRepository {
    create(seller:SellerDTO):Promise<ISellerEntity>
    findByUserId(userId:string):Promise<ISellerEntity | null>
}