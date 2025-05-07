import { Document, ObjectId, model } from "mongoose";
import { ICarCommentsEntity } from "../../../entities/models/car.comments.entity";
import { CarCommentSchema } from "../schemas/car.comment.schema";

export interface ICarCommentModel extends Omit<ICarCommentsEntity, "id" | "carId" | "userId" | "parentId" | "likes">, Document {
  _id: ObjectId;
  carId: ObjectId;
  userId: ObjectId;
  parentId?: ObjectId | null;
  likes?: ObjectId[];
}

export const CarCommentModel = model<ICarCommentModel>("CarComment",CarCommentSchema)