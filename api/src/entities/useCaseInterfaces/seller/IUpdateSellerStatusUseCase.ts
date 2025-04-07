import { ISellerEntity } from "../../models/seller.entity";

export interface IUpdateSellerStatusUseCase {
    execute(id:string,status:"approved" | "rejected"):Promise<ISellerEntity>
}