import { CommentWithBidsDto, IGetAllCommentsAndBidsUseCase } from "../../entities/useCaseInterfaces/comments/IGetAllCommentsAndBidsUseCase";
import { inject,injectable } from "tsyringe";
import { IBidRepository } from "../../entities/repositoryInterfaces/bid/IBidRepository";
import { ICarCommentRepository } from "../../entities/repositoryInterfaces/comments/ICarCommentRepository";


@injectable()
export class GetAllCommentsAndBidUseCase implements IGetAllCommentsAndBidsUseCase{
    constructor(
        @inject("IBidRepository") private _bidRepository:IBidRepository,
        @inject("ICarCommentRepository") private _carCommentRepository:ICarCommentRepository
    ){}
    async execute(carId:string): Promise<CommentWithBidsDto> {
        const [comments, bids] = await Promise.all([
            this._carCommentRepository.findAllByCarId(carId),
            this._bidRepository.findAllByCarId(carId),
        ]);
        
        return {
            comments,bids
        }
    }
}