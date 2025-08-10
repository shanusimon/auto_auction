import { IBidEntity } from "../../entities/models/bid.entity";
import { IGetAllBidsUseCase } from "../../entities/useCaseInterfaces/bid/IGetAllBidsUseCase";
import { IBidRepository } from "../../entities/repositoryInterfaces/bid/IBidRepository";
import { ICarRepository } from "../../entities/repositoryInterfaces/car/ICarRepository";
import { inject, injectable } from "tsyringe";

@injectable()
export class GetAllBidsUseCase implements IGetAllBidsUseCase{
    constructor(
        @inject("IBidRepository") private _bidRepository:IBidRepository,
        @inject("ICarRepository") private carRepository:ICarRepository
    ){}
    async execute(userId: string): Promise<IBidEntity[] | []> {
        const bids = await this._bidRepository.findByUserId(userId);
        return bids
    }
}