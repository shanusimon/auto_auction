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
    type:String,required:true,default:"text"
  },
  content: { type: String, required: true },
  sendAt: { type: Date, default: Date.now },
  isRead: { type: Boolean, default: false },
});

