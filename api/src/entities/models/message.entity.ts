export interface IMessage{
    id:string;
    conversationId:string;
    senderId:string;
    content:string;
    type:string;
    imageUrl:string;
    sendAt:Date;
    isRead:boolean
}