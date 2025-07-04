import { IUpdateSellerStatusUseCase } from "../../entities/useCaseInterfaces/seller/IUpdateSellerStatusUseCase";
import { inject, injectable } from "tsyringe";
import { IClientRepository } from "../../entities/repositoryInterfaces/client/IClient-repository.interface";
import { ISellerRepository } from "../../entities/repositoryInterfaces/seller/ISellerRepository";
import { CustomError } from "../../entities/utils/custom.error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../shared/constants";
import { ISellerEntity } from "../../entities/models/seller.entity";
import { messaging } from "../../shared/config";
import { INotificationRepository } from "../../entities/repositoryInterfaces/notification/INotificationRepository";
import { NotificationType } from "../../shared/types/notification.Types";
import { ISellerBaseRepository } from "../../entities/repositoryInterfaces/seller/ISellerBaseRepository";
import { IClientBaseRepository } from "../../entities/repositoryInterfaces/client/IClientBaseRepository";
export enum SellerStatus {
  APPROVED = "approved",
  REJECTED = "rejected",
}

@injectable()
export class UpdateSellerStatusUseCase implements IUpdateSellerStatusUseCase {
  constructor(
    @inject("IClientRepository") private clientRepository: IClientRepository,
    @inject("ISellerRepository") private sellerRepository: ISellerRepository,
    @inject("INotificationRepository")
    private notificationRepository: INotificationRepository,
    @inject("ISellerBaseRepository")
    private sellerBaseRepository: ISellerBaseRepository,
    @inject("IClientBaseRepository")
    private clientBaseRepository: IClientBaseRepository
  ) {}

  async execute(
    id: string,
    status: SellerStatus,
    reason: string | undefined
  ): Promise<ISellerEntity | null> {
    const seller = await this.sellerRepository.findOne(id);
    if (!seller) {
      throw new CustomError(
        ERROR_MESSAGES.USER_NOT_FOUND,
        HTTP_STATUS.BAD_REQUEST
      );
    }

    const user = await this.clientBaseRepository.findById(seller.userId);

    if (status === SellerStatus.APPROVED) {
      seller.approvalStatus = status;
      seller.sellerSince = new Date();
      seller.isActive = true;
      seller.isSeller = true;

      const updated = await this.sellerBaseRepository.update(seller);
      if (!updated) {
        throw new CustomError(
          ERROR_MESSAGES.UPDATE_FAILED,
          HTTP_STATUS.INTERNAL_SERVER_ERROR
        );
      }

      if (user?.id) {
        await this.notificationRepository.create(
          user.id,
          NotificationType.SELLER_REQUEST_APPROVAL,
          "Your Seller Request Has Been Approved",
          "Seller Approved"
        );
      }

      if (user?.fcmToken) {
        try {
          await messaging.send({
            notification: {
              title: "Seller Approval",
              body: "Congratulations! You’ve been approved as a seller on Auto Auction.",
            },
            token: user.fcmToken,
          });
          console.log(`FCM sent to user ${user.id} for approval.`);
        } catch (err) {
          console.error(`Failed to send approval FCM to user ${user.id}:`, err);
        }
      }

      return updated;
    }

    if (status === SellerStatus.REJECTED) {
      if (user?.id) {
        await this.notificationRepository.create(
          user.id,
          NotificationType.SELLER_REQUEST_REJECT,
          `Reason: ${reason || "No reason provided"}`,
          "Seller Request Rejected"
        );
      }

      if (user?.fcmToken) {
        try {
          await messaging.send({
            notification: {
              title: "Seller Application Update",
              body: "Your seller application has been rejected. Please contact support for more details.",
            },
            token: user.fcmToken,
          });
          console.log(`FCM sent to user ${user.id} for rejection.`);
        } catch (err) {
          console.error(
            `Failed to send rejection FCM to user ${user.id}:`,
            err
          );
        }
      }
      if (seller._id) {
        await this.sellerBaseRepository.delete(seller._id.toString());
      }
      return null;
    }

    throw new CustomError("Invalid status", HTTP_STATUS.BAD_REQUEST);
  }
}
