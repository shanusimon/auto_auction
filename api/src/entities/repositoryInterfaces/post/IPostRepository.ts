import { IPostEntity } from "../../models/post.entity";

export interface IPostRepository {
  create(
    userId: string,
    description: string,
    media: string,
    mediaType: "image" | "video"
  ): Promise<IPostEntity>;
  findByUser(userId: string): Promise<IPostEntity[]>;
  findPaginated(skip: number, limit: number): Promise<IPostEntity[]>;
  addOrRemoveLike(postId:string,userId:string):Promise<void>
}
