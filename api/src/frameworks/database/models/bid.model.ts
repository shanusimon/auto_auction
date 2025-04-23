import { model } from "mongoose";
import { IBidEntity } from "../../../entities/models/bid.entity";
import { bidSchema } from "../schemas/bid.schema";

export const BidModel = model<IBidEntity>("Bid", bidSchema);
