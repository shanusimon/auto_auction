import { IGetCarDetailsUseCase } from "../../entities/useCaseInterfaces/car/ICarDetailsUseCase";
import { inject, injectable } from "tsyringe";
import { ICarRepository } from "../../entities/repositoryInterfaces/car/ICarRepository";
import { ICarEntity } from "../../entities/models/car.entity";
import { ISellerRepository } from "../../entities/repositoryInterfaces/seller/ISellerRepository";
import { CustomError } from "../../entities/utils/custom.error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../shared/constants";
import { ISellerEntity } from "../../entities/models/seller.entity";

@injectable()
export class GetCarDetailsUseCase implements IGetCarDetailsUseCase {
  constructor(
    @inject("ICarRepository") private carRepository: ICarRepository,
    @inject("ISellerRepository") private sellerRepository: ISellerRepository,
  ) {}
  async execute(
    carId: string
  ): Promise<{ car: ICarEntity; seller: ISellerEntity | null }> {
    const car = await this.carRepository.findOne({_id:carId});
    if (!car) {
      throw new CustomError(
        ERROR_MESSAGES.CAR_NOT_FOUND,
        HTTP_STATUS.BAD_REQUEST
      );
    }
    const seller = await this.sellerRepository.findSellerDetails(
      car.sellerId.toString()
    );
    return { car, seller };
  }
}
