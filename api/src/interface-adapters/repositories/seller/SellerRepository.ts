import { ISellerRepository } from "../../../entities/repositoryInterfaces/seller/sellerRepository";
import { ISellerEntity } from "../../../entities/models/seller.entity";
import { SellerModel } from "../../../frameworks/database/models/seller.model";
import { SellerDTO } from "../../../shared/dtos/user.dto";
import { Types } from "mongoose";
import { CustomError } from "../../../entities/utils/custom.error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../../shared/constants";


export class SellerRepository implements ISellerRepository{
    async create(seller: SellerDTO): Promise<ISellerEntity> {
        const register = await SellerModel.create(seller);
        console.log(register);
        return register
    }
    async findByUserId(userId: string): Promise<ISellerEntity | null> {
        const user = await SellerModel.findOne({userId});
        return user;
    }
    async find(filter: any, skip: number, limit: number): Promise<{ sellers: ISellerEntity[] | []; total: number; }> {
        const sellers = await SellerModel.find(filter)
        .populate('userId','name email phone clientId')
        .skip(skip)
        .limit(limit);
        return {sellers,total:sellers.length}
    }
    async count(filter: any): Promise<number> {
        return await SellerModel.countDocuments(filter);
    }
    async update(seller: ISellerEntity): Promise<ISellerEntity | null> {
        return await SellerModel.findByIdAndUpdate(seller._id,seller,{new:true}).exec();
    }
    async findOne(_id:string):Promise<ISellerEntity | null>{
        return await SellerModel.findById(_id).exec();
    }
    async findSellerDetails(_id: string): Promise<ISellerEntity | null> {
        const seller = await SellerModel.findById(_id).populate('userId','name email phone profileImage');
        return seller
    }
    async findByIdAndUpdateStatus(id: string): Promise<void> {
        const seller = await SellerModel.findById(id);
        if(!seller){
            throw new CustomError(
                "Seller Not Found",
                HTTP_STATUS.NOT_FOUND
            )
        }
        seller.isActive = !seller.isActive;
        await seller.save();
    }
}