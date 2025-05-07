import { Schema } from "mongoose";
import { IBidEntity } from "../../../entities/models/bid.entity";

export const bidSchema = new Schema<IBidEntity>(
  {
    carId: {
      type: Schema.Types.ObjectId,
      ref: "Car",
      required: [true, "Car ID is required"],
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "Client",
      required: [true, "User ID is required"],
    },
    amount: {
      type: Number,
      required: [true, "Bid amount is required"],
      min: [1, "Bid amount must be greater than 0"],
    },
    depositHeld:{
      type:Number,
      required:true,
      default:0
    },
    timestamp: {
      type: Date,
      default: () => new Date(),
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "outbid", "won","forfeited"],
      default: "active",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
