import { IPostEntity } from "../../models/post.entity";

export interface IGetPagenatedPostsUseCase {
    execute(limit:number,skip:number):Promise<IPostEntity[]>
}