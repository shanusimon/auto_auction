import { SellerDTO } from "../../../shared/dtos/user.dto";
import { ISellerEntity } from "../../models/seller.entity";


export interface ISellerRepository {
 
    findOne(_id:string):Promise<ISellerEntity | null>
    findSellerDetails(_id:string):Promise<ISellerEntity | null>
    findByIdAndUpdateStatus(id:string):Promise<void>

}