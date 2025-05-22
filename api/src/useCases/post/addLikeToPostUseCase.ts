import { IPostLikeUseCase } from "../../entities/useCaseInterfaces/post/IAddLikeToPostUseCase";
import { IPostRepository } from "../../entities/repositoryInterfaces/post/IPostRepository";
import { inject, injectable } from "tsyringe";
import { CustomError } from "../../entities/utils/custom.error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../shared/constants";

@injectable()
export class AddLikeToPostUseCase implements IPostLikeUseCase{
    constructor(
        @inject("IPostRepository") private postRepository:IPostRepository
    ){}
    async execute(userId: string, postId: string): Promise<void> {
        if(!userId || !postId){
            throw new CustomError(
                ERROR_MESSAGES.INVALID_CREDENTIALS,
                HTTP_STATUS.BAD_REQUEST,
            )
        }

        await this.postRepository.addOrRemoveLike(postId,userId);
    }
}