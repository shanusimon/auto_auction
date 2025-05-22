import { Schema } from "mongoose";
import { IMessageModel } from "../models/message.model";

export const MessageSchema = new Schema<IMessageModel>({
  conversationId: {
    type: Schema.Types.ObjectId,
    ref: "Conversation",
    required: true,
  },
  senderId: {
    type: Schema.Types.ObjectId,
    ref: "Client",
    required: true,
  },
  type:{
    type:String,required:true,enum:["text","image"]
  },
  imageUrl:{
    type:String
  },
  content: { type: String, required: true },
  sendAt: { type: Date, default: Date.now },
  isRead: { type: Boolean, default: false },
});

