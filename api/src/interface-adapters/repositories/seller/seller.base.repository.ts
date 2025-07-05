import { ISellerEntity } from "../../../entities/models/seller.entity";
import { ISellerBaseRepository } from "../../../entities/repositoryInterfaces/seller/ISellerBaseRepository";
import { SellerDTO } from "../../../shared/dtos/user.dto";
import { SellerModel } from "../../../frameworks/database/models/seller.model";

export class SellerBaseRepository implements ISellerBaseRepository {
  async count(filter: any): Promise<number> {
    return await SellerModel.countDocuments(filter);
  }

  async create(seller: SellerDTO): Promise<ISellerEntity> {
    const register = await SellerModel.create(seller);
    console.log(register);
    return register;
  }

  async find(
    filter: any,
    skip: number,
    limit: number
  ): Promise<{ sellers: ISellerEntity[] | []; total: number }> {
    const sellers = await SellerModel.find(filter)
      .populate("userId", "name email phone clientId")
      .skip(skip)
      .limit(limit);
    return { sellers, total: sellers.length };
  }

  async findByUserId(userId: string): Promise<ISellerEntity | null> {
    const user = await SellerModel.findOne({ userId });
    return user;
  }
  async delete(id: string): Promise<void> {
    await SellerModel.findByIdAndDelete(id);
  }

  async update(seller: ISellerEntity): Promise<ISellerEntity | null> {
    return await SellerModel.findByIdAndUpdate(seller._id, seller, {
      new: true,
    }).exec();
  }
}
