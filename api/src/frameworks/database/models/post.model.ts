import { model } from "mongoose";
import { IPostEntity } from "../../../entities/models/post.entity";
import { PostSchema } from "../schemas/post.schema";

export const PostModel = model<IPostEntity>('Post',PostSchema);