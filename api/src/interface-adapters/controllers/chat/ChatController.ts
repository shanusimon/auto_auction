import { inject, injectable } from "tsyringe";
import { IChatController } from "../../../entities/controllerInterfaces/chat/IChatController";
import { Server as SocketIOServer, Socket } from "socket.io";
import { IGetAllConversationUseCase } from "../../../entities/useCaseInterfaces/conversation/IGetAllConversationsUseCase";
import { IGetConversationUseCase } from "../../../entities/useCaseInterfaces/conversation/IGetConversationUseCase";
import { IJoinConversationUseCase } from "../../../entities/useCaseInterfaces/conversation/IJoinConversationUseCase";
import { IGetAllMessagesUseCase } from "../../../entities/useCaseInterfaces/message/IGetallmessagesUseCase";
import { ICreateMessageUseCase } from "../../../entities/useCaseInterfaces/message/ICreateMessageUseCase";

@injectable()
export class ChatController implements IChatController {
  private io?: SocketIOServer;

  constructor(
    @inject("IGetAllConversationUseCase") private getAllConversation: IGetAllConversationUseCase,
    @inject("IGetConversationUseCase") private getConversation: IGetConversationUseCase,
    @inject("IJoinConversationUseCase") private joinConversation: IJoinConversationUseCase,
    @inject("IGetAllMessagesUseCase") private getAllMessagesUseCase: IGetAllMessagesUseCase,
    @inject("ICreateMessageUseCase") private createMessageUseCase: ICreateMessageUseCase
  ) {}

  public initialize(io: SocketIOServer): void {
    this.io = io;
    this.initializeSocketEvents();
  }

  public initializeSocketEvents(): void {
    if (!this.io) {
      throw new Error("Socket.IO server not initialized");
    }

    this.io.on("connection", (socket: Socket) => {
      console.log("User Connected:", socket.id);

      socket.on("getConversations", async ({ userId }: { userId: string }) => {
        try {
          if (!userId) {
            socket.emit("error", { message: "userId is required" });
            console.log("getConversations: Missing userId");
            return;
          }
          console.log(`Fetching conversations for user: ${userId}`);
          const conversations = await this.getAllConversation.execute(userId);
          console.log("this is conversation list the changed",conversations)
          socket.emit("conversationsList", { conversations: conversations || [] });
          console.log(`Emitted conversationsList to ${socket.id}:`, conversations?.length || 0, "conversations");
        } catch (error) {
          console.error("Error fetching conversations:", error);
          socket.emit("error", { message: "Failed to fetch conversations" });
        }
      });

      socket.on("startConversation", async ({ userId, sellerId }: { userId: string; sellerId: string }) => {
        try {
          if (!userId || !sellerId) {
            socket.emit("error", { message: "userId and sellerId are required" });
            console.log("startConversation: Missing userId or sellerId");
            return;
          }
          if (userId === sellerId) {
            socket.emit("error", { message: "Cannot start conversation with yourself" });
            console.log(`startConversation: userId ${userId} equals sellerId ${sellerId}`);
            return;
          }
          console.log(`Starting conversation between ${userId} and ${sellerId}`);
          const conversation = await this.getConversation.execute(userId, sellerId);
          console.log(`Conversation created/fetched: ${conversation.id}`, {
            user1Id: conversation.user1Id,
            user2Id: conversation.user2Id,
          });
          socket.emit("conversationStarted", { conversationId: conversation.id });
          console.log(`Emitted conversationStarted to ${socket.id}: ${conversation.id}`);
        } catch (error) {
          console.error("Error starting conversation:", error, { userId, sellerId });
          socket.emit("error", { message: "Failed to start conversation" });
        }
      });

      socket.on("joinConversation", async ({ userId, conversationId }: { userId: string; conversationId: string }) => {
        try {
          if (!userId || !conversationId) {
            socket.emit("error", { message: "userId and conversationId are required" });
            console.log("joinConversation: Missing userId or conversationId");
            return;
          }
          console.log(`User ${userId} joining conversation ${conversationId}`);
          const conversation = await this.joinConversation.execute(userId, conversationId);
          if (!conversation) {
            socket.emit("error", { message: "Unauthorized or conversation not found" });
            console.log(`Conversation ${conversationId} not found or user ${userId} unauthorized`);
            return;
          }
          socket.join(conversationId);
          const messages = await this.getAllMessagesUseCase.execute(conversationId);
          socket.emit("joinedConversation", {
            conversationId,
            messages: messages || [],
          });
          console.log(`Emitted joinedConversation to ${socket.id}: ${conversationId}, ${messages.length} messages`);
        } catch (error) {
          console.error("Error joining conversation:", error, { userId, conversationId });
          socket.emit("error", { message: "Failed to join conversation" });
        }
      });

      socket.on(
        "sendMessage",
        async ({
          userId,
          conversationId,
          content,
          senderId,
          type,
        }: {
          userId: string;
          conversationId: string;
          content: string;
          senderId: string;
          type: string;
        }) => {
          try {
            if (!userId || !conversationId || !senderId || !content || !type) {
              socket.emit("error", { message: "userId, conversationId, senderId, content, and type are required" });
              console.log("sendMessage: Missing required fields");
              return;
            }
            if (userId !== senderId) {
              socket.emit("error", { message: "userId must match senderId" });
              console.log(`sendMessage: userId ${userId} does not match senderId ${senderId}`);
              return;
            }
            console.log(`User ${userId} sending message to ${conversationId}: ${content}`);
            const conversation = await this.joinConversation.execute(userId, conversationId);
            if (!conversation) {
              socket.emit("error", { message: "Unauthorized or conversation not found" });
              console.log(`Conversation ${conversationId} not found or user ${userId} unauthorized`);
              return;
            }
            if (type !== "text") {
              socket.emit("error", { message: "Only text messages are supported" });
              console.log(`Invalid message type: ${type}`);
              return;
            }
            const message = await this.createMessageUseCase.execute(conversationId, senderId, content, type);
            const messagePayload = {
              id: message.id,
              conversationId: message.conversationId,
              senderId: message.senderId,
              content: message.content,
              sendAt: message.sendAt.toISOString(),
              isRead: message.isRead,
              type: message.type,
            };
            this.io!.to(conversationId).emit("newMessage", { message: messagePayload });
            socket.emit("messageSent", {
              success: true,
              message: "Message sent successfully",
            });
            console.log(`Emitted newMessage to room ${conversationId}:`, messagePayload);
          } catch (error) {
            console.error("Error sending message:", error);
            socket.emit("error", { message: "Failed to send message" });
          }
        }
      );

      socket.on("disconnect", (reason) => {
        console.log(`User Disconnected: ${socket.id} (${reason})`);
      });
    });
  }
}