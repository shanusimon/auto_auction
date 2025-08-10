import { IUpdateCarStatus } from "../../entities/useCaseInterfaces/car/IUpdateCarStatus";
import { injectable, inject } from "tsyringe";
import { ICarRepository } from "../../entities/repositoryInterfaces/car/ICarRepository";
import { ICarEntity } from "../../entities/models/car.entity";
import { CustomError } from "../../entities/utils/custom.error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../shared/constants";
import { INodemailerService } from "../../entities/services/INodeMailerService";

@injectable()
export class UpdateCarStatus implements IUpdateCarStatus {
  constructor(
    @inject("ICarRepository") private _carRepository: ICarRepository,
    @inject("INodemailerService") private _mailService: INodemailerService,

  ) {}
  async execute(
    carId: string,
    status: "approved" | "rejected",
    sellerEmail: string,
    rejectionReason?: string
  ): Promise<void> {
    const car = await this._carRepository.findOne({_id:carId});
    if (!car) {
      throw new CustomError(
        ERROR_MESSAGES.CAR_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND
      );
    }
    const updateData: Partial<ICarEntity> = {
      approvalStatus: status,
    };

    if (status === "approved") {
      updateData.auctionStartTime = new Date();
      const durationInDays = parseFloat(car.auctionDuration);
      const durationInMs = durationInDays * 24 * 60 * 60 * 1000;

      updateData.auctionEndTime = new Date(
        updateData.auctionStartTime.getTime() + durationInMs
      );
      await this._mailService.sendCarApprovalEmail(sellerEmail, car);
    } else {
      if (!rejectionReason) {
        throw new CustomError(
          ERROR_MESSAGES.REJECTION_REASON_IS_NEEDED,
          HTTP_STATUS.BAD_REQUEST
        );
      }
      await this._carRepository.updateRejectionReason(carId, rejectionReason);
      await this._mailService.sendCarRejectEmail(
        sellerEmail,
        car,
        rejectionReason
      );
    }
    await this._carRepository.findByIdAndUpdate(carId, updateData as ICarEntity);
  }
}
