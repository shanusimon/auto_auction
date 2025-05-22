import { Schema } from "mongoose";
import { ICommunity } from "../../../entities/models/community.entity";


export const CommunitySchema = new Schema<ICommunity>(
    {
        name:{type:String,required:true},
        description:{type:String,required:true},
        createdAt:{type:Date,required:true},
        createdBy:{type:Schema.Types.ObjectId,ref:"Client"},
        isActive:{type:Boolean,default:false}
    }
)
