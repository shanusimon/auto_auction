import { IPostEntity } from "../../../entities/models/post.entity";
import { IPostRepository } from "../../../entities/repositoryInterfaces/post/IPostRepository";
import { PostModel } from "../../../frameworks/database/models/post.model";
import mongoose, { Types } from "mongoose";

export class PostRepository implements IPostRepository {
  async create(
    userId: string,
    description: string,
    media: string,
    mediaType: "image" | "video"
  ): Promise<IPostEntity> {
    const post = await PostModel.create({
      userId: new Types.ObjectId(userId),
      description,
      media,
      mediaType,
      createdAt: new Date(),
      likes: [],
      comments: [],
    });

    return post.toObject();
  }

  async findByUser(userId: string): Promise<IPostEntity[]> {
    return await PostModel.find({ userId });
  }

  async findPaginated(skip: number, limit: number): Promise<IPostEntity[]> {
    return await PostModel.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("userId", "name profileImage");
  }
  async addOrRemoveLike(postId: string, userId: string): Promise<void> {
    const post = await PostModel.findById(postId);
    if (!post) throw new Error("Post not found");

    const likeIds = post.likes || [];

    const hasLiked = likeIds.includes(userId);
    console.log("This is from DB",hasLiked);

    if (hasLiked) {
      post.likes = likeIds.filter((id) => id.toString() !== userId);
      console.log("From DB",post);

    } else {
      post.likes?.push(userId);
    }

    await post.save();
  }
}
