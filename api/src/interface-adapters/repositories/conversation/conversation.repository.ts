import { IConversationRepository } from "../../../entities/repositoryInterfaces/conversation/IConversationRepository";
import { IConversation } from "../../../entities/models/conversation.entity";
import { ConversationModel } from "../../../frameworks/database/models/conversation.model";
import { Types } from "mongoose";

// Type for populated user data
interface PopulatedUser {
  _id: Types.ObjectId;
  name: string;
  profileImage: string;
}

// Type for lean conversation document
interface LeanConversation {
  _id: Types.ObjectId;
  user1Id: PopulatedUser | null;
  user2Id: PopulatedUser | null;
  createdAt: Date;
  updatedAt: Date;
  lastMessage?: {
    content: string;
    sendAt: Date;
    senderId: Types.ObjectId | string;
  };
  __v?: number;
}

export class ConversationRepository implements IConversationRepository {
  constructor() {}

  async createConversation(data: {
    user1Id: string;
    user2Id: string;
    lastMessage?: { content: string; sendAt: Date; senderId: string };
  }): Promise<IConversation> {
    const { user1Id, user2Id, lastMessage } = data;

    // Validate ObjectId format
    if (!Types.ObjectId.isValid(user1Id) || !Types.ObjectId.isValid(user2Id)) {
      throw new Error("Invalid user1Id or user2Id");
    }

    // Validate that user1Id and user2Id are different
    if (user1Id === user2Id) {
      throw new Error("Cannot create a conversation with the same user");
    }

    const conversation = await ConversationModel.create({
      user1Id: new Types.ObjectId(user1Id),
      user2Id: new Types.ObjectId(user2Id),
      lastMessage: lastMessage
        ? {
            content: lastMessage.content,
            sendAt: lastMessage.sendAt,
            senderId: new Types.ObjectId(lastMessage.senderId),
          }
        : undefined,
    });

    // Populate user1Id and user2Id after creation
    const populatedConversation = await ConversationModel.findById(conversation._id)
      .populate<{ user1Id: PopulatedUser | null; user2Id: PopulatedUser | null }>(
        "user1Id user2Id",
        "_id name profileImage"
      )
      .lean({ virtuals: true });

    if (!populatedConversation) {
      throw new Error("Failed to populate created conversation");
    }

    return this.mapToEntity(populatedConversation as unknown as LeanConversation);
  }

  async findConversation(user1Id: string, user2Id: string): Promise<IConversation | null> {
    if (!Types.ObjectId.isValid(user1Id) || !Types.ObjectId.isValid(user2Id)) {
      throw new Error("Invalid user1Id or user2Id");
    }

    const conversation = await ConversationModel.findOne({
      $or: [
        { user1Id: new Types.ObjectId(user1Id), user2Id: new Types.ObjectId(user2Id) },
        { user1Id: new Types.ObjectId(user2Id), user2Id: new Types.ObjectId(user1Id) },
      ],
    })
      .populate<{ user1Id: PopulatedUser | null; user2Id: PopulatedUser | null }>(
        "user1Id user2Id",
        "_id name profileImage"
      )
      .lean({ virtuals: true });

    if (!conversation) return null;

    return this.mapToEntity(conversation as unknown as LeanConversation);
  }

  async findAllConversations(userId: string): Promise<IConversation[]> {
    if (!Types.ObjectId.isValid(userId)) {
      throw new Error("Invalid userId");
    }

    const objectId = new Types.ObjectId(userId);
    const conversations = await ConversationModel.find({
      $or: [{ user1Id: objectId }, { user2Id: objectId }],
    })
      .populate<{ user1Id: PopulatedUser | null; user2Id: PopulatedUser | null }>(
        "user1Id user2Id",
        "_id name profileImage"
      )
      .lean({ virtuals: true });


    return conversations
      .filter((conv) => {
        if (!conv.user1Id || !conv.user2Id || conv.user1Id._id.toString() === conv.user2Id._id.toString()) {
          console.warn("Invalid conversation skipped:", {
            id: conv._id?.toString(),
            user1Id: conv.user1Id?._id?.toString(),
            user2Id: conv.user2Id?._id?.toString(),
          });
          return false;
        }
        return true;
      })
      .map((conv) => this.mapToEntity(conv as unknown as LeanConversation));
  }

  async findOne(userId: string, conversationId: string): Promise<IConversation | null> {
    if (!Types.ObjectId.isValid(userId) || !Types.ObjectId.isValid(conversationId)) {
      throw new Error("Invalid userId or conversationId");
    }

    const conversation = await ConversationModel.findOne({
      _id: new Types.ObjectId(conversationId),
      $or: [{ user1Id: new Types.ObjectId(userId) }, { user2Id: new Types.ObjectId(userId) }],
    })
      .populate<{ user1Id: PopulatedUser | null; user2Id: PopulatedUser | null }>(
        "user1Id user2Id",
        "_id name profileImage"
      )
      .lean({ virtuals: true });

    if (!conversation) return null;

    return this.mapToEntity(conversation as unknown as LeanConversation);
  }

  async updateLastMessage(id: string, content: string, senderId: string): Promise<void> {
    if (!Types.ObjectId.isValid(id) || !Types.ObjectId.isValid(senderId)) {
      throw new Error("Invalid conversationId or senderId");
    }

    await ConversationModel.updateOne(
      { _id: new Types.ObjectId(id) },
      {
        $set: {
          lastMessage: {
            content,
            sendAt: new Date(),
            senderId: new Types.ObjectId(senderId),
          },
          updatedAt: new Date(),
        },
      }
    );
  }

  private mapToEntity(conversation: LeanConversation): IConversation {
    if (!conversation || !conversation.user1Id || !conversation.user2Id) {
      throw new Error("Invalid conversation data: missing required fields");
    }

    const user1Id = conversation.user1Id as PopulatedUser;
    const user2Id = conversation.user2Id as PopulatedUser;

    return {
      id: conversation._id.toString(),
      user1Id: {
        _id: user1Id._id.toString(),
        name: user1Id.name || "Unknown",
        profileImage: user1Id.profileImage || "",
      },
      user2Id: {
        _id: user2Id._id.toString(),
        name: user2Id.name || "Unknown",
        profileImage: user2Id.profileImage || "",
      },
      createdAt: new Date(conversation.createdAt).toISOString(),
      updatedAt: new Date(conversation.updatedAt).toISOString(),
      lastMessage: conversation.lastMessage
        ? {
            content: conversation.lastMessage.content,
            sendAt: conversation.lastMessage.sendAt
              ? new Date(conversation.lastMessage.sendAt).toISOString()
              : new Date().toISOString(),
            senderId:
              conversation.lastMessage.senderId instanceof Types.ObjectId
                ? conversation.lastMessage.senderId.toString()
                : conversation.lastMessage.senderId.toString(),
          }
        : undefined,
    };
  }
}