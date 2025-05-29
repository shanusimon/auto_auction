import { Schema, Types } from "mongoose";
import { IAuctionWonEntity } from "../../../entities/models/auction.won.entity";

const AuctionStatusValues = ["sold", "not-sold", "cancelled", "in-progress"] as const;

export const AuctionWonSchema = new Schema<IAuctionWonEntity>({
  carId: {
    type: Types.ObjectId,
    required: true,
    ref: "Car",
  },
  winnerId: {
    type: Types.ObjectId,
    required: true,
    ref: "Client",
  },
  sellerId:{
    type:Types.ObjectId,
    required:true,
    ref:"Client"
  },
  amount: {
    type: Number,
    required: true,
  },
  platformCharge: {
    type: Number,
    required: true,
  },
  paymentIntentId: {
    type: String,
    default:null,
  },
  stripeSessionId:{
    type:String,
   default:null
  },
  auctionStatus:{
    type:String,
    enum:AuctionStatusValues,
    required:true
  },
  bidId:{
    type:String,
    required:true
  },
  paymentStatus: {
    type: String,
    enum: ["pending", "succeeded", "failed"],
    default: "pending",
    required: true,
  },
  receiptUrl: { type: String },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
