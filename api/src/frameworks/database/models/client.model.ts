import { Document,ObjectId, model } from "mongoose";
import { IClientEntity } from "../../../entities/models/client.entity";
import { ClientSchema } from "../schemas/client.schema";

export interface IClientModel extends Omit<IClientEntity,"id">,Document{
    _id:ObjectId;
}

export const ClientModel = model<IClientModel>("Client",ClientSchema);
