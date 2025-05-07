import { CreateCommentDto } from "../../../shared/dtos/create.car.comment.dto";
import { ICarCommentsEntity } from "../../models/car.comments.entity";

export interface ICreateCommentUseCase {
    execute(commentDto:CreateCommentDto):Promise<void>
}