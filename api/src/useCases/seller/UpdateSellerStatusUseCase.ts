import { IUpdateSellerStatusUseCase } from "../../entities/useCaseInterfaces/seller/IUpdateSellerStatusUseCase";
import { inject, injectable } from "tsyringe";
import { IClientRepository } from "../../entities/repositoryInterfaces/client/IClient-repository.interface";
import { ISellerRepository } from "../../entities/repositoryInterfaces/seller/sellerRepository";
import { CustomError } from "../../entities/utils/custom.error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../shared/constants";
import { ISellerEntity } from "../../entities/models/seller.entity";

export enum SellerStatus {
  APPROVED = "approved",
  REJECTED = "rejected",
}

@injectable()
export class updateSellerStatusUseCase implements IUpdateSellerStatusUseCase {
  constructor(
    @inject("IClientRepository") private clientRepository: IClientRepository,
    @inject("ISellerRepository") private sellerRepository: ISellerRepository
  ) {}
  async execute(id: string, status: SellerStatus): Promise<ISellerEntity> {
    const seller = await this.sellerRepository.findOne(id);
    console.log(seller)
    if (!seller) {
      throw new CustomError(
        ERROR_MESSAGES.USER_NOT_FOUND,
        HTTP_STATUS.BAD_REQUEST
      );
    }
    seller.approvalStatus = status;
    if (status === "approved") {
      seller.sellerSince = new Date();
      seller.isSeller = true;
    } else if (status === "rejected") {
      seller.sellerSince = undefined;
      seller.isSeller = false;
    }

    const updated = await this.sellerRepository.update(seller);
    console.log("this is updated",updated);
    if (!updated) {
      throw new CustomError(
        ERROR_MESSAGES.UPDATE_FAILED,
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      );
    }

    return updated;
  }
}
