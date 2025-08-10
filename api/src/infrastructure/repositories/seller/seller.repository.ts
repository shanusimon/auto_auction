import { ISellerRepository } from "../../../entities/repositoryInterfaces/seller/ISellerRepository";
import { ISellerEntity } from "../../../entities/models/seller.entity";
import { SellerModel } from "../../../frameworks/database/models/seller.model";
import { CustomError } from "../../../entities/utils/custom.error";
import { HTTP_STATUS } from "../../../shared/constants";
import { SellerDTO } from "../../../shared/dtos/user.dto";
import { BaseRepository } from "../base-repository";

export class SellerRepository
  extends BaseRepository<ISellerEntity>
  implements ISellerRepository
{
  constructor() {
    super(SellerModel);
  }

  async findSellerDetails(_id: string): Promise<ISellerEntity | null> {
    const seller = await SellerModel.findById(_id).populate(
      "userId",
      "name email phone profileImage"
    );
    return seller;
  }
  async findByIdAndUpdateStatus(id: string): Promise<void> {
    const seller = await SellerModel.findById(id);
    if (!seller) {
      throw new CustomError("Seller Not Found", HTTP_STATUS.NOT_FOUND);
    }
    seller.isActive = !seller.isActive;
    await seller.save();
  }
  async create(seller: SellerDTO): Promise<ISellerEntity> {
    const register = await SellerModel.create(seller);
    return register;
  }
  async count(filter: any): Promise<number> {
    return await SellerModel.countDocuments(filter);
  }
  async findPaginatedAndPopulated(
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

  async update(seller: ISellerEntity): Promise<ISellerEntity | null> {
    return await SellerModel.findByIdAndUpdate(seller._id, seller, {
      new: true,
    }).exec();
  }
}
