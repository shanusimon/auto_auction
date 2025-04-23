import { ObjectId } from "mongoose";
import { BodyType,FuelType } from "../../shared/types/car.types";

export interface ICarEntity{
    _id?:string| ObjectId;
    sellerId:ObjectId;
    title:string;
    make:string;
    model:string;
    year:number;
    mileage:number;
    reservedPrice?:number;
    bodyType:BodyType;
    location:string;
    description: string;
    fuel: FuelType;
    transmission: string;
    exteriorColor: string;
    interiorColor: string;
    auctionDuration: string;
    images:string[];
    approvalStatus:"pending" | "approved" | "rejected";
    auctionStartTime?: Date;
    auctionEndTime?: Date;
    winnerId?: ObjectId;
    highestBid?: number;
    highestBidderId?: ObjectId;
}

