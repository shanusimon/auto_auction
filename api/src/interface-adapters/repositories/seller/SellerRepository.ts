import { ISellerRepository } from "../../../entities/repositoryInterfaces/seller/sellerRepository";
import { ISellerEntity } from "../../../entities/models/seller.entity";
import { SellerModel } from "../../../frameworks/database/models/seller.model";
import { SellerDTO } from "../../../shared/dtos/user.dto";


export class SellerRepository implements ISellerRepository{
    async create(seller: SellerDTO): Promise<ISellerEntity> {
        return await SellerModel.create(seller)
    }
    async findByUserId(userId: string): Promise<ISellerEntity | null> {
        const user = await SellerModel.findOne({userId});
        return user;
    }
}