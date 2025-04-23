import { ObjectId } from "mongoose";

export interface IBidEntity {
  _id?: string | ObjectId;
  carId: ObjectId;         
  userId: ObjectId;        
  amount: number;        
  timestamp: Date;       
  status: "active" | "outbid" | "won";
}
