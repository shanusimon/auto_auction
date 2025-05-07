import { ICreateCommentUseCase } from "../../entities/useCaseInterfaces/comments/ICreateCommentUseCase";
import { inject,injectable } from "tsyringe";
import { CreateCommentDto } from "../../shared/dtos/create.car.comment.dto";
import { ICarCommentRepository } from "../../entities/repositoryInterfaces/comments/ICarCommentRepository";

@injectable()
export class CreateCommentUseCase implements ICreateCommentUseCase{
    constructor(
        @inject("ICarCommentRepository") private carCommentRepository:ICarCommentRepository
        ){}
    async execute(commentDto: CreateCommentDto): Promise<void> {

        const {carId,userId,content,parentId} = commentDto;

        await this.carCommentRepository.create({
            carId,
            userId,
            content,
            parentId:parentId || null
        })
    }
}