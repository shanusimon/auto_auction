import { ObjectId } from "mongoose";

export interface ICommunity{
    _id:ObjectId;
    name:String;
    description:String;
    createdBy:ObjectId,
    createdAt:Date,
    isActive:Boolean
}