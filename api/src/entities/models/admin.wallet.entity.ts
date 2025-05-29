import { ObjectId } from "mongoose";

export interface IAdminWallet {
  _id?: string | ObjectId;
  balanceAmount: number;
  transaction: {
    transactionId: string;
    userName: string;
    auctionId: string | ObjectId;
    carId: string | ObjectId;
    amountReceived: number;
    commissionAmount: number;
    timeStamp: Date;
  }[];
  createdAt?: Date;
  updatedAt?: Date;
}
