import { CommentWithBidsDto, IGetAllCommentsAndBidsUseCase } from "../../entities/useCaseInterfaces/comments/IGetAllCommentsAndBidsUseCase";
import { inject,injectable } from "tsyringe";
import { IBidRepository } from "../../entities/repositoryInterfaces/bid/bidRepository";
import { ICarCommentRepository } from "../../entities/repositoryInterfaces/comments/ICarCommentRepository";


@injectable()
export class GetAllCommentsAndBidUseCase implements IGetAllCommentsAndBidsUseCase{
    constructor(
        @inject("IBidRepository") private bidRepository:IBidRepository,
        @inject("ICarCommentRepository") private carCommentRepository:ICarCommentRepository
    ){}
    async execute(carId:string): Promise<CommentWithBidsDto> {
        const [comments, bids] = await Promise.all([
            this.carCommentRepository.findAllByCarId(carId),
            this.bidRepository.findAllByCarId(carId),
        ]);
        
        return {
            comments,bids
        }
    }
}