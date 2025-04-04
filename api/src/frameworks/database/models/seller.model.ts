import { model } from "mongoose";
import { ISellerEntity } from "../../../entities/models/seller.entity";
import { SellerSchema } from "../schemas/seller.schema";

export const SellerModel = model<ISellerEntity>("Seller",SellerSchema);
