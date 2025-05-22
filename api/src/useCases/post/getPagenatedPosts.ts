import { IPostEntity } from "../../entities/models/post.entity";
import { IGetPagenatedPostsUseCase } from "../../entities/useCaseInterfaces/post/IGetPagnatedPosts";
import { IPostRepository } from "../../entities/repositoryInterfaces/post/IPostRepository";
import { inject, injectable } from "tsyringe";

@injectable()
export class getPagenatedPosts implements IGetPagenatedPostsUseCase{
    constructor(
        @inject("IPostRepository") private postRepository:IPostRepository
    ){}
    async execute(limit: number, skip: number): Promise<IPostEntity[]> {
         if (limit <= 0 || skip < 0) {
            throw new Error("Invalid pagination parameters");
        }
        const posts = await this.postRepository.findPaginated(skip,limit);
        return posts
    }
}