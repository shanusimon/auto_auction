import { IConversation } from "../../models/conversation.entity";

export interface IConversationRepository {
  createConversation(data: {
    user1Id: string;
    user2Id: string;
    lastMessage?: { content: string; sendAt: Date; senderId: string };
  }): Promise<IConversation>;
  findConversation(user1Id: string, user2Id: string): Promise<IConversation | null>;
  findAllConversations(userId: string): Promise<IConversation[]>;
  findOne(userId: string, conversationId: string): Promise<IConversation | null>;
  updateLastMessage(id: string, content: string, senderId: string): Promise<void>;
}