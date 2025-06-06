import { useState, useRef, useEffect, Component, ErrorInfo } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import AuctionSocket, { connectSocket, disconnectSocket } from "@/services/webSocket/webSockeService";
import Header from "@/components/header/Header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "react-toastify";
import {
  Search,
  Send,
  ChevronLeft,
  MessageCircle,
  MoreVertical,
  Image as ImageIcon,
  Loader2,
  X
} from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { uploadProfileImageCloudinary } from "@/utils/cloudinaryImageUpload";

interface Conversation {
  id: string;
  name: string;
  avatar?: string;
  lastMessage: string;
  time: string;
  unread: number;
  isOnline: boolean;
  user1Id: string;
  user2Id: string;
}

interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  sendAt: string;
  isRead: boolean;
  type: string;
  imageUrl?: string;
  isOptimistic?: boolean; // Added to track optimistic messages
}

class ChatErrorBoundary extends Component<{ children: React.ReactNode }, { hasError: boolean }> {
  state = { hasError: false };

  static getDerivedStateFromError(_: Error): { hasError: boolean } {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Error in ChatPage:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="h-screen flex flex-col items-center justify-center bg-black text-white">
          <h2 className="text-xl font-bold mb-4">Something went wrong</h2>
          <p className="text-zinc-400">Please refresh the page or try again later.</p>
        </div>
      );
    }
    return this.props.children;
  }
}

const ChatPage: React.FC = () => {
  const user = useSelector((state: RootState) => state.user.user);
  const currentUserId = user?.id;
  const navigate = useNavigate();
  const { conversationId: urlConversationId } = useParams<{ conversationId?: string }>();
  const location = useLocation();
  const stateConversationId = location.state?.conversationId;
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoadingConversations, setIsLoadingConversations] = useState(true);
  const [isJoiningConversation, setIsJoiningConversation] = useState(false);
  const [messageInput, setMessageInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    if (!currentUserId) {
      console.error("User not authenticated, redirecting to login");
      toast.error("Please log in to access chats");
      navigate("/login");
    }
  }, [currentUserId, navigate]);

  useEffect(() => {
    if (!currentUserId) return;

    connectSocket();

    AuctionSocket.on("connect", () => {
      console.log("Socket connected, authenticating...");
      AuctionSocket.emit("authenticate", { userId: currentUserId });
      if (activeChatId) {
        AuctionSocket.emit("joinConversation", {
          userId: currentUserId,
          conversationId: activeChatId,
        });
      }
    });

    AuctionSocket.on("disconnect", () => {
      console.log("Socket disconnected, attempting to reconnect...");
    });

    AuctionSocket.emit("authenticate", { userId: currentUserId });

    const pingInterval = setInterval(() => {
      AuctionSocket.emit("ping");
    }, 30000);

    AuctionSocket.on("pong", () => {
      console.log("Pong received from server");
    });

    AuctionSocket.emit("getConversations", { userId: currentUserId });

    AuctionSocket.on("conversationsList", ({ conversations }) => {
      console.log("Received conversationsList:", conversations);
      const validConversations = Array.isArray(conversations) ? conversations : [];
      setConversations(
        validConversations.map((conv: any) => {
          const user1 = conv.user1Id;
          const user2 = conv.user2Id;
          const isUser1CurrentUser = user1._id === currentUserId;
          const otherUser = isUser1CurrentUser ? user2 : user1;

          AuctionSocket.emit("checkUserStatus", { userId: otherUser._id });

          return {
            id: conv.id || "",
            name: otherUser.name || "Unknown",
            avatar: otherUser.profileImage || undefined,
            lastMessage: conv.lastMessage?.content || "",
            time: conv.lastMessage?.sendAt || conv.createdAt || new Date().toISOString(),
            unread: conv.unread || 0,
            isOnline: false,
            user1Id: user1._id,
            user2Id: user2._id,
          };
        })
      );
      setIsLoadingConversations(false);
    });

    AuctionSocket.on("userStatus", ({ userId, isOnline }: { userId: string; isOnline: boolean }) => {
      console.log(`Received userStatus: ${userId} is ${isOnline ? "online" : "offline"}`);
      setConversations((prev) =>
        prev.map((conv) => {
          const otherUserId = conv.user1Id === currentUserId ? conv.user2Id : conv.user1Id;
          if (otherUserId === userId) {
            return { ...conv, isOnline };
          }
          return conv;
        })
      );
    });

    AuctionSocket.on("conversationStarted", ({ conversationId }) => {
      console.log("Received conversationStarted:", conversationId);
      navigate(`/user/chats/conversation/${conversationId}`, {
        state: { conversationId },
        replace: true,
      });
      AuctionSocket.emit("getConversations", { userId: currentUserId });
    });

    AuctionSocket.on("joinedConversation", ({ conversationId, messages }) => {
      console.log("Received joinedConversation:", { conversationId, messages });
      setActiveChatId(conversationId);
      setMessages(Array.isArray(messages) ? messages : []);
      setIsJoiningConversation(false);
    });

    AuctionSocket.on("newMessage", ({ message }) => {
      console.log("Received newMessage:", message);
      if (!message || !message.content) {
        console.error("Invalid message in newMessage event:", message);
        return;
      }
      if (!message.sendAt) {
        message.sendAt = new Date().toISOString();
      }
      setMessages((prev) => {
        if (prev.some((m) => m.id === message.id)) {
          return prev;
        }
        if (message.senderId === currentUserId) {
          return prev; // Skip current user's messages, handled by messageSent
        }
        if (message.conversationId === activeChatId) {
          return [...prev, message];
        }
        return prev;
      });
      if (message.senderId !== currentUserId) {
        setConversations((prev) =>
          prev.map((conv) =>
            conv.id === message.conversationId
              ? { ...conv, lastMessage: message.type === "image" ? "Sent an image" : message.content, time: message.sendAt }
              : conv
          )
        );
      }
    });

    AuctionSocket.on("messageSent", ({ success, message }) => {
      console.log("Received messageSent:", { success, message });
      if (success && message) {
        if (!message.sendAt) {
          message.sendAt = new Date().toISOString();
        }
        setMessages((prev) => {
          // Find optimistic message with matching properties
          const optimisticMatch = prev.find(
            (m) =>
              m.isOptimistic &&
              m.conversationId === message.conversationId &&
              m.senderId === message.senderId &&
              m.content === message.content &&
              Math.abs(new Date(m.sendAt).getTime() - new Date(message.sendAt).getTime()) < 5000 // Within 5 seconds
          );
          if (optimisticMatch) {
            // Replace the optimistic message
            return prev.map((m) =>
              m.id === optimisticMatch.id ? { ...message, isOptimistic: false } : m
            );
          }
          // If no optimistic match, append only if message ID doesn't exist
          if (!prev.some((m) => m.id === message.id)) {
            return [...prev, { ...message, isOptimistic: false }];
          }
          return prev;
        });
        const displayContent = message.type === "image" ? "Sent an image" : message.content;
        setConversations((prev) =>
          prev.map((conv) =>
            conv.id === message.conversationId
              ? { ...conv, lastMessage: displayContent, time: message.sendAt }
              : conv
          )
        );
      } else {
        toast.error("Failed to send message. Please try again.");
      }
    });

    AuctionSocket.on("error", ({ message }) => {
      console.error("Socket error:", message, { userId: currentUserId, conversationId: activeChatId });
      toast.error(message);
      setIsLoadingConversations(false);
      setIsJoiningConversation(false);
      if (message.includes("Unauthorized")) {
        navigate("/login");
      }
    });

    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
      AuctionSocket.off("connect");
      AuctionSocket.off("disconnect");
      AuctionSocket.off("conversationsList");
      AuctionSocket.off("conversationStarted");
      AuctionSocket.off("joinedConversation");
      AuctionSocket.off("newMessage");
      AuctionSocket.off("messageSent");
      AuctionSocket.off("error");
      AuctionSocket.off("userStatus");
      AuctionSocket.off("pong");
      clearInterval(pingInterval);
      disconnectSocket();
    };
  }, [currentUserId, navigate, activeChatId]);

  useEffect(() => {
    if (!currentUserId) return;

    const joinConversation = () => {
      let convId = stateConversationId || urlConversationId;
      if (convId && convId !== activeChatId) {
        console.log("Emitting joinConversation for conversationId:", convId);
        setIsJoiningConversation(true);
        AuctionSocket.emit("joinConversation", { userId: currentUserId, conversationId: convId });
        const conversation = conversations.find((c) => c.id === convId);
        if (conversation) {
          const otherUserId = conversation.user1Id === currentUserId ? conversation.user2Id : conversation.user1Id;
          AuctionSocket.emit("checkUserStatus", { userId: otherUserId });
        }
        setActiveChatId(convId);
      }
    };

    joinConversation();
  }, [stateConversationId, urlConversationId, currentUserId, conversations]);

  useEffect(() => {
    if (!currentUserId || conversations.length > 0) return;
    console.log("Refreshing conversations due to activeChatId change:", activeChatId);
    AuctionSocket.emit("getConversations", { userId: currentUserId });
  }, [activeChatId, currentUserId, conversations.length]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (messageInput.trim() === "" && !selectedFile && !imagePreview) return;
    if (!activeChatId || !currentUserId) return;

    const tempId = `temp-${Date.now()}`;
    const now = new Date();
    const formattedDate = now.toISOString();

    if (selectedFile && imagePreview) {
      handleSendImage();
    } else {
      const optimisticMessage = {
        id: tempId,
        conversationId: activeChatId,
        senderId: currentUserId,
        content: messageInput,
        sendAt: formattedDate,
        isRead: false,
        type: "text",
        isOptimistic: true // Mark as optimistic
      };

      setMessages((prev) => [...prev, optimisticMessage]);

      console.log("Sending text message:", messageInput);
      AuctionSocket.emit("sendMessage", {
        userId: currentUserId,
        conversationId: activeChatId,
        content: messageInput,
        senderId: currentUserId,
        type: "text"
      });

      setMessageInput("");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
    if (!validImageTypes.includes(file.type)) {
      toast.error("Please select a valid image file (JPEG, PNG, GIF, WEBP, SVG)");
      e.target.value = '';
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB");
      e.target.value = '';
      return;
    }

    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    setSelectedFile(file);
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
  };

  const handleCancelImage = () => {
    setSelectedFile(null);
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
      setImagePreview(null);
    }
  };

  const handleSendImage = async () => {
    if (!selectedFile || !activeChatId || !currentUserId) {
      toast.error("Missing required information for sending image");
      return;
    }

    setIsUploading(true);

    try {
      const imageData = await uploadProfileImageCloudinary(selectedFile);
      console.log("Cloudinary response:", imageData);

      let imageUrl;
      if (typeof imageData === 'string') {
        imageUrl = imageData;
      } else if (typeof imageData === 'object' && imageData !== null) {
        imageUrl = imageData;
      } else {
        console.error("Invalid response from image upload:", imageData);
        throw new Error("Invalid response from image upload service");
      }

      if (!imageUrl || typeof imageUrl !== 'string') {
        console.error("Invalid image URL:", imageUrl);
        throw new Error("Invalid image URL received from upload service");
      }

      console.log("Image uploaded successfully:", imageUrl);

      if (!AuctionSocket.connected) {
        console.log("Socket disconnected, attempting to reconnect");
        connectSocket();
        await new Promise((resolve) => setTimeout(resolve, 1000));
        if (!AuctionSocket.connected) {
          throw new Error("Could not connect to messaging service");
        }
      }

      AuctionSocket.emit("sendMessage", {
        userId: currentUserId,
        conversationId: activeChatId,
        content: "Sent an image",
        imageUrl: imageUrl,
        senderId: currentUserId,
        type: "image",
      });

      handleCancelImage();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error during image upload";
      console.error("Error uploading image:", error);
      toast.error(`Failed to upload image: ${errorMessage}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleBackToList = () => {
    setActiveChatId(null);
    navigate("/user/chats");
  };

  const handleSelectConversation = (conversation: Conversation) => {
    if (conversation.id === activeChatId) {
      console.log("Already in conversation:", conversation.id);
      return;
    }
    setActiveChatId(conversation.id);
    console.log("Joining conversation:", conversation.id);
    setIsJoiningConversation(true);
    AuctionSocket.emit("joinConversation", {
      userId: currentUserId,
      conversationId: conversation.id,
    });
    const otherUserId = conversation.user1Id === currentUserId ? conversation.user2Id : conversation.user1Id;
    AuctionSocket.emit("checkUserStatus", { userId: otherUserId });
    navigate(`/user/chats/conversation/${conversation.id}`, {
      state: { conversationId: conversation.id },
    });
  };

  const activeChat = conversations.find((c) => c.id === activeChatId);
  const filteredConversations = searchTerm
    ? conversations.filter(
        (c) =>
          c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.lastMessage.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : conversations;

  return (
    <ChatErrorBoundary>
      <div className="h-screen flex flex-col bg-black text-white">
        <Header />
        <div className="flex-1 flex overflow-hidden">
          <div
            className={`w-full md:w-1/3 lg:w-1/4 bg-zinc-900 border-r border-zinc-800 flex flex-col
                       transition-all duration-300 ease-in-out
                       ${activeChatId ? "hidden md:flex" : "flex"}`}
          >
            <div className="p-4 border-b border-zinc-800">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-[#3BE188]" />
                Messages
              </h2>
              <div className="relative">
                <Input
                  placeholder="Search conversations"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-zinc-800 border-zinc-700 text-white transition-all duration-200 focus:ring-1 focus:ring-[#3BE188]"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 h-4 w-4" />
              </div>
            </div>

            <ScrollArea className="flex-1 h-full">
              {isLoadingConversations ? (
                <div className="p-4 text-center text-zinc-400">Loading conversations...</div>
              ) : (
                <div>
                  {filteredConversations.length === 0 ? (
                    <div className="p-4 text-center text-zinc-400">
                      No conversations found
                    </div>
                  ) : (
                    filteredConversations.map((conversation) => (
                      <div
                        key={conversation.id}
                        onClick={() => handleSelectConversation(conversation)}
                        className={`flex items-center p-4 hover:bg-zinc-800 cursor-pointer border-b border-zinc-800
                                   transition-all duration-200 ${conversation.id === activeChatId ? 'bg-zinc-800' : ''}`}
                      >
                        <div className="relative mr-3">
                          <Avatar className="h-12 w-12 border border-zinc-700 transition-all duration-300 hover:scale-105">
                            <AvatarImage src={conversation.avatar || undefined} />
                            <AvatarFallback className="bg-gradient-to-br from-zinc-700 to-zinc-800 text-zinc-300">
                              {conversation.name ? conversation.name.substring(0, 2).toUpperCase() : "UN"}
                            </AvatarFallback>
                          </Avatar>
                          {conversation.isOnline && (
                            <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-zinc-900 animate-pulse"></div>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <span className="font-medium">{conversation.name}</span>
                            <span className="text-xs text-zinc-400">
                              {conversation.time && new Date(conversation.time).toString() !== "Invalid Date"
                                ? new Date(conversation.time).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })
                                : new Date().toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                            </span>
                          </div>
                          <div className="flex justify-between mt-1">
                            <span className="text-sm text-zinc-400 truncate max-w-[180px]">
                              {conversation.lastMessage}
                            </span>
                            {conversation.unread > 0 && (
                              <div className="bg-[#3BE188] text-black text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                {conversation.unread}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </ScrollArea>
          </div>

          <div className={`flex-1 flex flex-col h-full ${!activeChatId ? "hidden md:flex" : ""}`}>
            {activeChatId ? (
              <div className="flex flex-col h-full">
                {isJoiningConversation ? (
                  <div className="flex justify-center items-center h-full text-zinc-400">
                    <Loader2 className="h-8 w-8 animate-spin" />
                    <span className="ml-2">Loading conversation...</span>
                  </div>
                ) : (
                  <>
                    <div className="bg-zinc-900 p-4 border-b border-zinc-800 flex items-center">
                      <button
                        onClick={handleBackToList}
                        className="md:hidden mr-2 text-zinc-400 hover:text-white transition-colors"
                      >
                        <ChevronLeft className="h-6 w-6" />
                      </button>
                      <Avatar className="h-10 w-10 mr-3 border border-zinc-700">
                        <AvatarImage src={activeChat?.avatar || undefined} />
                        <AvatarFallback className="bg-gradient-to-br from-zinc-700 to-zinc-800 text-zinc-300">
                          {activeChat?.name ? activeChat.name.substring(0, 2).toUpperCase() : "UN"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="font-medium">{activeChat?.name}</div>
                        <div className="text-xs text-zinc-400">
                          {activeChat?.isOnline ? (
                            <span className="flex items-center gap-1">
                              <span className="h-2 w-2 bg-green-500 rounded-full"></span>
                              Online
                            </span>
                          ) : (
                            "Offline"
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button className="text-zinc-400 hover:text-white transition-all duration-200 hover:scale-110">
                          <MoreVertical className="h-5 w-5" />
                        </button>
                      </div>
                    </div>

                    <div className="flex-1 p-4 bg-gradient-to-b from-black to-zinc-900 overflow-y-auto">
                      <div className="flex flex-col gap-4 pb-2">
                        {messages.length > 0 ? (
                          messages.map((message) => (
                            <div
                              key={message.id}
                              className={`flex ${
                                message.senderId === currentUserId ? "justify-end" : "justify-start"
                              }`}
                            >
                              <div
                                className={`max-w-[80%] rounded-lg overflow-hidden ${
                                  message.senderId === currentUserId
                                    ? "bg-[#3BE188] text-black"
                                    : "bg-zinc-800 text-white"
                                } shadow-lg`}
                              >
                                {message.type === "image" ? (
                                  <div className="max-w-sm">
                                    <img
                                      src={message.imageUrl || ""}
                                      alt="Chat image"
                                      className="w-full h-auto max-h-64 object-contain"
                                      onError={(e) => {
                                        (e.target as HTMLImageElement).src = "/placeholder-image.jpg";
                                      }}
                                    />
                                    <div className="px-3 py-2">
                                      <div
                                        className={`text-xs ${
                                          message.senderId === currentUserId ? "text-black/60" : "text-zinc-400"
                                        }`}
                                      >
                                        {message.sendAt && new Date(message.sendAt).toString() !== "Invalid Date"
                                          ? new Date(message.sendAt).toLocaleTimeString([], {
                                              hour: "2-digit",
                                              minute: "2-digit",
                                            })
                                          : new Date().toLocaleTimeString([], {
                                              hour: "2-digit",
                                              minute: "2-digit",
                                            })}
                                      </div>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="px-4 py-2">
                                    <div>{message.content}</div>
                                    <div
                                      className={`text-xs mt-1 ${
                                        message.senderId === currentUserId ? "text-black/60" : "text-zinc-400"
                                      }`}
                                    >
                                      {message.sendAt && new Date(message.sendAt).toString() !== "Invalid Date"
                                        ? new Date(message.sendAt).toLocaleTimeString([], {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                          })
                                        : new Date().toLocaleTimeString([], {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                          })}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="flex justify-center items-center h-full text-zinc-400">
                            No messages yet. Start the conversation!
                          </div>
                        )}
                        <div ref={messagesEndRef} />
                      </div>
                    </div>

                    {imagePreview && (
                      <div className="p-3 bg-zinc-800 border-t border-zinc-700">
                        <div className="relative inline-block">
                          <img
                            src={imagePreview}
                            alt="Selected image"
                            className="h-24 w-auto rounded-md object-cover border border-zinc-600"
                          />
                          <button
                            onClick={handleCancelImage}
                            className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1 hover:bg-red-600 transition-colors"
                            disabled={isUploading}
                          >
                            <X className="h-4 w-4 text-white" />
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="p-4 bg-zinc-900 border-t border-zinc-800">
                      <div className="flex flex-col">
                        <div className="flex items-end">
                          <input
                            type="file"
                            ref={fileInputRef}
                            accept="image/*"
                            onChange={handleFileChange}
                            className="hidden"
                          />
                          <Button
                            onClick={() => fileInputRef.current?.click()}
                            className="mr-2 bg-zinc-800 hover:bg-zinc-700 text-white h-[40px] w-[40px] p-2 rounded-lg flex-shrink-0 transition-all duration-200"
                            disabled={isUploading || !!imagePreview}
                          >
                            {isUploading ? (
                              <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                              <ImageIcon className="h-5 w-5" />
                            )}
                          </Button>
                          {messageInput.length > 50 ? (
                            <Textarea
                              placeholder="Type a message..."
                              value={messageInput}
                              onChange={(e) => setMessageInput(e.target.value)}
                              onKeyDown={handleKeyDown}
                              disabled={isUploading}
                              className="flex-1 bg-zinc-800 border-zinc-700 text-white min-h-[80px] rounded-r-none transition-all duration-200 focus:ring-1 focus:ring-[#3BE188]"
                            />
                          ) : (
                            <Input
                              placeholder="Type a message..."
                              value={messageInput}
                              onChange={(e) => setMessageInput(e.target.value)}
                              onKeyDown={handleKeyDown}
                              disabled={isUploading}
                              className="flex-1 bg-zinc-800 border-zinc-700 text-white rounded-r-none transition-all duration-200 focus:ring-1 focus:ring-[#3BE188]"
                            />
                          )}
                          <Button
                            onClick={handleSendMessage}
                            disabled={(messageInput.trim() === "" && !imagePreview) || isUploading}
                            className="ml-0 bg-[#3BE188] hover:bg-[#32BA72] text-black rounded-l-none h-[40px] px-4 transition-all duration-200 hover:shadow-md"
                          >
                            {isUploading ? (
                              <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                              <Send className="h-5 w-5" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-zinc-900">
                <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-full p-6 mb-4 shadow-lg border border-zinc-700">
                  <MessageCircle className="h-12 w-12 text-[#3BE188]" />
                </div>
                <h3 className="text-xl font-bold mb-2">Select a conversation</h3>
                <p className="text-zinc-400 max-w-md">
                  Choose a conversation from the list or start a new chat to begin messaging
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </ChatErrorBoundary>
  );
};

export default ChatPage;