import { IGetWonAuctionUseCase } from "../../entities/useCaseInterfaces/auction/IGetWonAuctionUseCase";
import { inject,injectable } from "tsyringe";
import { AuctionWonRepositoryInterface } from "../../entities/repositoryInterfaces/auctionwon/IAuctionWonRepositoryInterface";
import { IAuctionWonEntity } from "../../entities/models/auction.won.entity";

@injectable()
export class GetWonAuctionUseCase implements IGetWonAuctionUseCase{
    constructor(
   @inject("AuctionWonRepositoryInterface") private auctionWonRepository: AuctionWonRepositoryInterface,
    ){}
    async execute(userId: string): Promise<IAuctionWonEntity[] | []> {
        const auctionWon = await this.auctionWonRepository.findAuctionsByWinnerId(userId);
        return auctionWon
    }
}