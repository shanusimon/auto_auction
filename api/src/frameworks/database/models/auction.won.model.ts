import { model } from "mongoose";
import { IAuctionWonEntity } from "../../../entities/models/auction.won.entity";
import { AuctionWonSchema } from "../schemas/auction.won.schema";

export const AuctionWonModel = model<IAuctionWonEntity>("AuctionWon",AuctionWonSchema);