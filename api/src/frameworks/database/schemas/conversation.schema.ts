import { Schema } from "mongoose";
import { IConversationDocument } from "../models/conversation.model";

export const ConversationSchema = new Schema<IConversationDocument>(
  {
    user1Id: { type: Schema.Types.ObjectId, ref: "Client", required: true },
    user2Id: { type: Schema.Types.ObjectId, ref: "Client", required: true },
    createdAt: { type: Date },
    updatedAt: { type: Date },
    lastMessage: {
      content: { type: String },
      sendAt: { type: Date },
      senderId: { type: Schema.Types.ObjectId, ref: "Client" },
    },
  },
  { timestamps: true }
);

