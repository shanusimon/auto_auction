import { IBidEntity } from "../../entities/models/bid.entity";
import { IGetBidHistoryUseCase } from "../../entities/useCaseInterfaces/bid/IGetBidHistoryUseCase";
import { inject,injectable } from "tsyringe";
import { IBidRepository } from "../../entities/repositoryInterfaces/bid/IBidRepository";
import { ICarRepository } from "../../entities/repositoryInterfaces/car/ICarRepository";
import { CustomError } from "../../entities/utils/custom.error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../shared/constants";

@injectable()
export class getBidHistoryUseCase implements IGetBidHistoryUseCase{
    constructor(
        @inject("IBidRepository") private bidRepository:IBidRepository,
        @inject("ICarRepository") private carRepository:ICarRepository,
    ){}
    async execute(carId: string): Promise<IBidEntity[]> {
        const car = await this.carRepository.findOne({_id:carId});
        if(!car || !car._id){
            throw new CustomError(
                ERROR_MESSAGES.CAR_NOT_FOUND,
                HTTP_STATUS.BAD_REQUEST
            )
        }

        const bids = await this.bidRepository.findAllByCarId(car._id.toString());

        return bids;
    }
}