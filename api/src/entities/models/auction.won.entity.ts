import { ObjectId } from "mongoose";

export type AuctionStatus =
  | 'sold'
  | 'not-sold'
  | 'cancelled'
  | 'in-progress';


export interface IAuctionWonEntity {
  _id?: string | ObjectId;
  carId: string | ObjectId;
  winnerId:string | ObjectId | null;
  sellerId:string | ObjectId | null
  amount: number;
  bidId:string | ObjectId;
  platformCharge: number;
  paymentIntentId: string | null;
  stripeSessionId:string | null;
  auctionStatus:AuctionStatus
  paymentStatus: 'pending' | 'succeeded' | 'failed';
  receiptUrl?: string;
  createdAt: Date;
}
