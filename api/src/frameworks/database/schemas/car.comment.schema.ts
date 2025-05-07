import { Schema } from "mongoose";
import { ICarCommentModel } from "../models/car.comment.model";

export const CarCommentSchema = new Schema<ICarCommentModel>(
  {
    carId: { type: Schema.Types.ObjectId, ref: "Car", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "Client", required: true },
    content: { type: String, required: true },
    parentId: { type: Schema.Types.ObjectId, ref: "CarComment", default: null },
    likes: [{ type: Schema.Types.ObjectId, ref: "Client" }]
  },
  { timestamps: true }
);
