import { ICarEntity } from "../../../entities/models/car.entity";
import { Schema } from "mongoose";
import { BodyType, FuelType } from "../../../shared/types/car.types";

export const carSchema = new Schema<ICarEntity>(
  {
    sellerId: {
      type: Schema.Types.ObjectId,
      ref: "Seller",
      required: [true, "Seller ID is required"],
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      minlength: [5, "Title must be at least 5 characters"],
    },
    make: {
      type: String,
      required: [true, "Make is required"],
      minlength: [1, "Make cannot be empty"],
    },
    vehicleNumber: {
      type: String,
      required: [true, "Vehicle number is required"],
      minlength: [5, "Vehicle number must be exactly 5 digits"],
    },
    model: {
      type: String,
      required: [true, "Model is required"],
      minlength: [1, "Model cannot be empty"],
    },
    year: {
      type: Number,
      required: [true, "Year is required"],
      min: [1900, "Year must be at least 1900"],
      max: [2025, "Year cannot be greater than 2025"],
    },
    mileage: {
      type: Number,
      required: [true, "Mileage is required"],
      min: [0, "Mileage must be a positive number"],
    },
    reservedPrice: {
      type: Number,
      min: [0, "Reserved price must be positive"],
      required: false,
    },
    bodyType: {
      type: String,
      enum: {
        values: Object.values(BodyType),
        message: "{VALUE} is not a valid body type",
      },
      required: [true, "Body type is required"],
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      minlength: [3, "Location must be at least 3 characters"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      minlength: [30, "Description must be at least 30 characters"],
    },
    fuel: {
      type: String,
      enum: {
        values: Object.values(FuelType),
        message: "{VALUE} is not a valid fuel type",
      },
      required: [true, "Fuel type is required"],
    },
    transmission: {
      type: String,
      required: [true, "Transmission type is required"],
      minlength: [1, "Transmission type cannot be empty"],
    },
    exteriorColor: {
      type: String,
      required: [true, "Exterior color is required"],
      minlength: [1, "Exterior color cannot be empty"],
    },
    interiorColor: {
      type: String,
      required: [true, "Interior color is required"],
      minlength: [3, "Interior color must be at least 3 characters"],
    },
    auctionDuration: {
      type: String,
      required: [true, "Auction duration is required"],
      minlength: [1, "Auction duration cannot be empty"],
    },
    approvalStatus: {
      type: String,
      required: true,
      default: "pending",
    },
    images: {
      type: [String],
      required: true,
    },
    auctionStartTime: { type: Date },
    auctionEndTime: { type: Date },
    winnerId: { type: Schema.Types.ObjectId, ref: "User" },
    highestBid: { type: Number, default: 0 }, 
    highestBidderId: { type: Schema.Types.ObjectId, ref: "User" }, 
    rejectionReason:{
      type: String,
      default: ""
    }
  },
  {
    timestamps: true,
  }
);