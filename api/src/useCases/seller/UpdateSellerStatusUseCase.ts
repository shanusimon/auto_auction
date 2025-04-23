import { IUpdateSellerStatusUseCase } from "../../entities/useCaseInterfaces/seller/IUpdateSellerStatusUseCase";
import { inject, injectable } from "tsyringe";
import { IClientRepository } from "../../entities/repositoryInterfaces/client/IClient-repository.interface";
import { ISellerRepository } from "../../entities/repositoryInterfaces/seller/sellerRepository";
import { CustomError } from "../../entities/utils/custom.error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../shared/constants";
import { ISellerEntity } from "../../entities/models/seller.entity";
import { messaging } from "../../shared/config";

export enum SellerStatus {
  APPROVED = "approved",
  REJECTED = "rejected",
}

@injectable()
export class UpdateSellerStatusUseCase implements IUpdateSellerStatusUseCase {
  constructor(
    @inject("IClientRepository") private clientRepository: IClientRepository,
    @inject("ISellerRepository") private sellerRepository: ISellerRepository
  ) {}

  async execute(id: string, status: SellerStatus): Promise<ISellerEntity> {
    const seller = await this.sellerRepository.findOne(id);
    if (!seller) {
      throw new CustomError(ERROR_MESSAGES.USER_NOT_FOUND, HTTP_STATUS.BAD_REQUEST);
    }

    seller.approvalStatus = status;
    if (status === SellerStatus.APPROVED) {
      seller.sellerSince = new Date();
      seller.isActive = true;
      seller.isSeller = true;
    } else if (status === SellerStatus.REJECTED) {
      seller.sellerSince = undefined;
      seller.isSeller = false;
    }

    const updated = await this.sellerRepository.update(seller);
    if (!updated) {
      throw new CustomError(ERROR_MESSAGES.UPDATE_FAILED, HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }

    const user = await this.clientRepository.findById(seller.userId);
    if (user?.fcmToken) {

      if (status === SellerStatus.APPROVED) {
        const message = {
          notification: {
            title: "Seller Approval",
            body: "Congratulations! You’ve been approved as a seller on Auto Auction.",
          },
          token: user.fcmToken,
        };
        try {
          await messaging.send(message);
          console.log(`Notification sent to user ${seller.userId} for ${status} status`);
        } catch (err) {
          console.error(`Failed to send notification to user ${seller.userId}:`, err);
        }
      } else if (status === SellerStatus.REJECTED) {
        const message = {
          notification: {
            title: "Seller Application Update",
            body: "Your seller application has been rejected. Please contact support for more details.",
          },
          token: user.fcmToken,
        };
        try {
          await messaging.send(message);
          console.log(`Notification sent to user ${seller.userId} for ${status} status`);
        } catch (err) {
          console.error(`Failed to send notification to user ${seller.userId}:`, err);
        }
      }
    } else {
      console.log(`No FCM token found for user ${seller.userId}`);
    }

    return updated;
  }
}