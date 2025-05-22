import { model } from "mongoose";
import { ICommunity } from "../../../entities/models/community.entity";
import { CommunitySchema } from "../schemas/community.schema";


export const CommunityModel = model<ICommunity>("Community",CommunitySchema);