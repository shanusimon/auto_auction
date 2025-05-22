import { Schema, model } from "mongoose";
import { IPostEntity } from "../../../entities/models/post.entity";

export const PostSchema = new Schema<IPostEntity>({
  userId: { type: Schema.Types.ObjectId, ref: "Client", required: true },
  description: { type: String, required: true },
  media: { type: String, required: true },
  mediaType: { type: String, enum: ["image", "video"], required: true },
  createdAt: { type: Date, default: Date.now },
  likes: [{ type: Schema.Types.ObjectId, ref: "Client" }],
  comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
});

