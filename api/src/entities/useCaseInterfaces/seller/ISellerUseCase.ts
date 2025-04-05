import { SellerDTO } from "../../../shared/dtos/user.dto";
import { ISellerEntity } from "../../models/seller.entity";

export interface ISellerRegisterUseCase {
    execute(dto:SellerDTO):Promise<ISellerEntity>
}