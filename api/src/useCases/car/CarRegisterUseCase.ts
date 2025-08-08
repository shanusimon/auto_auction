import { ICarRegisterUseCase } from "../../entities/useCaseInterfaces/car/ICarRegisterUsecase";
import { inject, injectable } from "tsyringe";
import { CreateCarDTO } from "../../shared/dtos/car.dto";
import { ISellerRepository } from "../../entities/repositoryInterfaces/seller/ISellerRepository";
import { CustomError } from "../../entities/utils/custom.error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../shared/constants";
import { ICarRepository } from "../../entities/repositoryInterfaces/car/ICarRepository";

@injectable()
export class CarRegisterUseCase implements ICarRegisterUseCase {
  constructor(
    @inject("ISellerRepository") private sellerRepository: ISellerRepository,
    @inject("ICarRepository") private carReposioty: ICarRepository,
  ) {}
  async execute(userId: string, carDeatails: CreateCarDTO): Promise<void> {
    const seller = await this.sellerRepository.findByUserId(userId);
    if (!seller) {
      throw new CustomError(
        ERROR_MESSAGES.SELLER_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND
      );
    }
    const car = await this.carReposioty.findByVehicleNumber(
      carDeatails.vehicleNumber
    );
    console.log(car);
    if (car) {
      throw new CustomError(
        ERROR_MESSAGES.CAR_ALREADY_EXISTS,
        HTTP_STATUS.BAD_REQUEST
      );
    }

    const carData = {
      ...carDeatails,
      sellerId: seller._id,
      approvalStatus: "pending",
    };
    await this.carReposioty.create(carData);
  }
}
