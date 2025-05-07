import { Document, Schema,model} from "mongoose";
import { ConversationSchema } from "../schemas/conversation.schema";

export interface IConversationDocument extends Document {
  user1Id: Schema.Types.ObjectId;
  user2Id: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  lastMessage?: {
    content: string;
    sendAt: Date;
    senderId: Schema.Types.ObjectId;
  };
}
export const ConversationModel = model<IConversationDocument>("Conversation", ConversationSchema);

