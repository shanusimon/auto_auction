export interface IConversation {
  id: string;
  user1Id: {
    _id: string;
    name: string;
    profileImage: string;
  };
  user2Id: {
    _id: string;
    name: string;
    profileImage: string;
  };
  createdAt: string;
  updatedAt: string;
  lastMessage?: {
    content: string;
    sendAt: string;
    senderId: string;
  };
}