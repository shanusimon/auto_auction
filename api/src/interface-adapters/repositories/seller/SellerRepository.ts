import { ISellerRepository } from "../../../entities/repositoryInterfaces/seller/ISellerRepository";
import { ISellerEntity } from "../../../entities/models/seller.entity";
import { SellerModel } from "../../../frameworks/database/models/seller.model";
import { CustomError } from "../../../entities/utils/custom.error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../../shared/constants";

export class SellerRepository implements ISellerRepository {
  async findOne(_id: string): Promise<ISellerEntity | null> {
    return await SellerModel.findById(_id).exec();
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
}
