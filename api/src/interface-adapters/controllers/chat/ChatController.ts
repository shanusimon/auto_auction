import { inject, injectable } from "tsyringe";
import { IChatController } from "../../../entities/controllerInterfaces/chat/IChatController";
import { Server as SocketIOServer, Socket } from "socket.io";
import { IGetAllConversationUseCase } from "../../../entities/useCaseInterfaces/conversation/IGetAllConversationsUseCase";
import { IGetConversationUseCase } from "../../../entities/useCaseInterfaces/conversation/IGetConversationUseCase";
import { IJoinConversationUseCase } from "../../../entities/useCaseInterfaces/conversation/IJoinConversationUseCase";
import { IGetAllMessagesUseCase } from "../../../entities/useCaseInterfaces/message/IGetallmessagesUseCase";
import { ICreateMessageUseCase } from "../../../entities/useCaseInterfaces/message/ICreateMessageUseCase";
import { ISendNotificationUseCase } from "../../../entities/useCaseInterfaces/message/ISendNotificationUseCase";

@injectable()
export class ChatController implements IChatController {
  private io?: SocketIOServer;
  private onlineUsers: Map<string, Set<string>> = new Map();

  constructor(
    @inject("IGetAllConversationUseCase")
    private getAllConversation: IGetAllConversationUseCase,
    @inject("IGetConversationUseCase")
    private getConversation: IGetConversationUseCase,
    @inject("IJoinConversationUseCase")
    private joinConversation: IJoinConversationUseCase,
    @inject("IGetAllMessagesUseCase")
    private getAllMessagesUseCase: IGetAllMessagesUseCase,
    @inject("ICreateMessageUseCase")
    private createMessageUseCase: ICreateMessageUseCase,
    @inject("ISendNotificationUseCase")
    private sendNotificationUseCase: ISendNotificationUseCase
  ) {}

  public initialize(io: SocketIOServer): void {
    this.io = io;
    this.initializeSocketEvents();
  }

  private async broadcastUserStatus(
    userId: string,
    isOnline: boolean
  ): Promise<void> {
    try {
      const conversations = await this.getAllConversation.execute(userId);

      const participantIds = new Set<string>();
      for (const conversation of conversations) {
        if (conversation.user1Id.toString() !== userId)
          participantIds.add(conversation.user1Id.toString());
        if (conversation.user2Id.toString() !== userId)
          participantIds.add(conversation.user2Id.toString());
      }

      for (const participantId of participantIds) {
        const socketIds = this.onlineUsers.get(participantId);
        if (socketIds) {
          socketIds.forEach((socketId) => {
            this.io!.to(socketId).emit("userStatus", { userId, isOnline });
          });
        }
      }
      console.log(
        `Broadcasted ${userId} is ${isOnline ? "online" : "offline"} to ${
          participantIds.size
        } users`
      );
    } catch (error) {
      console.error(`Error broadcasting status for ${userId}:`, error);
    }
  }

  public initializeSocketEvents(): void {
    if (!this.io) {
      throw new Error("Socket.IO server not initialized");
    }

    this.io.on("connection", (socket: Socket) => {
      console.log("User Connected:", socket.id);

      socket.on("authenticate", ({ userId }: { userId: string }) => {
        if (!userId) {
          socket.emit("error", {
            message: "userId is required for authentication",
          });
          return;
        }
        if (!this.onlineUsers.has(userId)) {
          this.onlineUsers.set(userId, new Set());
        }
        this.onlineUsers.get(userId)!.add(socket.id);
        console.log(`User ${userId} is online with socket ${socket.id}`);

        this.broadcastUserStatus(userId, true);
      });

      socket.on("checkUserStatus", ({ userId }: { userId: string }) => {
        if (!userId) {
          socket.emit("error", { message: "userId is required" });
          return;
        }
        const isOnline = this.onlineUsers.has(userId);
        socket.emit("userStatus", { userId, isOnline });
        console.log(
          `Checked status for ${userId}: ${isOnline ? "online" : "offline"}`
        );
      });

      socket.on("ping", () => {
        socket.emit("pong");
        console.log(`Ping received from ${socket.id}`);
      });

      socket.on("getConversations", async ({ userId }: { userId: string }) => {
        try {
          if (!userId) {
            socket.emit("error", { message: "userId is required" });
            console.log("getConversations: Missing userId");
            return;
          }
          console.log(`Fetching conversations for user: ${userId}`);
          const conversations = await this.getAllConversation.execute(userId);
          socket.emit("conversationsList", {
            conversations: conversations || [],
          });
          console.log(
            `Emitted conversationsList to ${socket.id}:`,
            conversations?.length || 0,
            "conversations"
          );
        } catch (error) {
          console.error("Error fetching conversations:", error);
          socket.emit("error", { message: "Failed to fetch conversations" });
        }
      });

      socket.on(
        "startConversation",
        async ({ userId, sellerId }: { userId: string; sellerId: string }) => {
          try {
            if (!userId || !sellerId) {
              socket.emit("error", {
                message: "userId and sellerId are required",
              });
              console.log("startConversation: Missing userId or sellerId");
              return;
            }
            if (userId === sellerId) {
              socket.emit("error", {
                message: "Cannot start conversation with yourself",
              });
              console.log(
                `startConversation: userId ${userId} equals sellerId ${sellerId}`
              );
              return;
            }
            console.log(
              `Starting conversation between ${userId} and ${sellerId}`
            );
            const conversation = await this.getConversation.execute(
              userId,
              sellerId
            );
            console.log(`Conversation created/fetched: ${conversation.id}`, {
              user1Id: conversation.user1Id,
              user2Id: conversation.user2Id,
            });
            socket.emit("conversationStarted", {
              conversationId: conversation.id,
            });
            console.log(
              `Emitted conversationStarted to ${socket.id}: ${conversation.id}`
            );
          } catch (error) {
            console.error("Error starting conversation:", error, {
              userId,
              sellerId,
            });
            socket.emit("error", { message: "Failed to start conversation" });
          }
        }
      );

      socket.on(
        "joinConversation",
        async ({
          userId,
          conversationId,
        }: {
          userId: string;
          conversationId: string;
        }) => {
          try {
            if (!userId || !conversationId) {
              socket.emit("error", {
                message: "userId and conversationId are required",
              });
              console.log("joinConversation: Missing userId or conversationId");
              return;
            }
            console.log(
              `User ${userId} joining conversation ${conversationId}`
            );
            const conversation = await this.joinConversation.execute(
              userId,
              conversationId
            );
            if (!conversation) {
              socket.emit("error", {
                message: "Unauthorized or conversation not found",
              });
              console.log(
                `Conversation ${conversationId} not found or user ${userId} unauthorized`
              );
              return;
            }
            socket.join(conversationId);
            const messages = await this.getAllMessagesUseCase.execute(
              conversationId
            );
            socket.emit("joinedConversation", {
              conversationId,
              messages: messages || [],
            });
            console.log(
              `Emitted joinedConversation to ${socket.id}: ${conversationId}, ${messages.length} messages`
            );
          } catch (error) {
            console.error("Error joining conversation:", error, {
              userId,
              conversationId,
            });
            socket.emit("error", { message: "Failed to join conversation" });
          }
        }
      );

      socket.on(
        "sendMessage",
        async ({
          userId,
          conversationId,
          content,
          senderId,
          type,
          imageUrl,
        }: {
          userId: string;
          conversationId: string;
          content: string;
          senderId: string;
          type: string;
          imageUrl: string;
        }) => {
          try {
            if (!userId || !conversationId || !senderId || !content || !type) {
              socket.emit("error", {
                message:
                  "userId, conversationId, senderId, content, and type are required",
              });
              console.log("sendMessage: Missing required fields");
              return;
            }
            if (userId !== senderId) {
              socket.emit("error", { message: "userId must match senderId" });
              console.log(
                `sendMessage: userId ${userId} does not match senderId ${senderId}`
              );
              return;
            }
            console.log(
              `User ${userId} sending message to ${conversationId}: ${content}`
            );
            const conversation = await this.joinConversation.execute(
              userId,
              conversationId
            );
            if (!conversation) {
              socket.emit("error", {
                message: "Unauthorized or conversation not found",
              });
              console.log(
                `Conversation ${conversationId} not found or user ${userId} unauthorized`
              );
              return;
            }
            if (type !== "text" && type !== "image") {
              socket.emit("error", {
                message:
                  "Invalid message type, only text and image are supported",
              });
              console.log(`Invalid message type: ${type}`);
              return;
            }
            const message = await this.createMessageUseCase.execute(
              conversationId,
              senderId,
              content,
              type,
              imageUrl
            );
            const messagePayload = {
              id: message.id,
              conversationId: message.conversationId,
              senderId: message.senderId,
              content: message.content,
              imageUrl: message.imageUrl,
              sendAt: message.sendAt.toISOString(),
              isRead: message.isRead,
              type: message.type,
            };
            this.io!.to(conversationId).emit("newMessage", {
              message: messagePayload,
            });
            socket.emit("messageSent", {
              success: true,
              message: messagePayload,
            });

            const user1Id = conversation.user1Id._id
              ? conversation.user1Id._id.toString()
              : conversation.user1Id.toString();
            const user2Id = conversation.user2Id._id
              ? conversation.user2Id._id.toString()
              : conversation.user2Id.toString();

            const reciptentId = user1Id === senderId ? user2Id : user1Id;
            const senderUser =
              user1Id === senderId
                ? conversation.user1Id
                : conversation.user2Id;
            const senderName = senderUser.name;

            const isRecipientOnline = this.onlineUsers.has(reciptentId);
            console.log(`${isRecipientOnline} isRecipientOnline`);

            if (!isRecipientOnline) {
              await this.sendNotificationUseCase.execute(
                reciptentId,
                message.content,
                senderName
              );
            }
            console.log(
              `Emitted newMessage to room ${conversationId}:`,
              messagePayload
            );
          } catch (error) {
            console.error("Error sending message:", error);
            socket.emit("error", { message: "Failed to send message" });
          }
        }
      );

      socket.on("disconnect", (reason) => {
        console.log(`User Disconnected: ${socket.id} (${reason})`);
        let userIdToRemove: string | undefined;
        for (const [userId, sockets] of this.onlineUsers) {
          if (sockets.has(socket.id)) {
            sockets.delete(socket.id);
            if (sockets.size === 0) {
              this.onlineUsers.delete(userId);
              userIdToRemove = userId;
            }
            break;
          }
        }
        if (userIdToRemove) {
          this.broadcastUserStatus(userIdToRemove, false);
        }
      });
    });
  }
}
