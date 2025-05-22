import { CreatePostDTO } from "../../../shared/dtos/post.dto";

export interface ICreatePostUseCase {
    execute(data:CreatePostDTO,userId:String):Promise<void>
}