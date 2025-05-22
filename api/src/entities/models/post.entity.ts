import { ObjectId } from "mongoose";

export interface IPostEntity {
  id: ObjectId;
  userId: ObjectId;
  description: string;
  media: string;
  mediaType: "image" | "video"; 
  createdAt: Date;
  likes?: string[];
  comments?: string[];
}
