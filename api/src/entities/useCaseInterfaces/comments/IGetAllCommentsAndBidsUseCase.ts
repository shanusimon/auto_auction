import { IBidEntity } from "../../models/bid.entity";
import { ICarCommentsEntity } from "../../models/car.comments.entity";

export interface CommentWithBidsDto{
    comments:ICarCommentsEntity[];
    bids:IBidEntity[]
}
export interface IGetAllCommentsAndBidsUseCase{
    execute(carId:string):Promise<CommentWithBidsDto>
}