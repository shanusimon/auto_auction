export interface IMessage{
    id:string;
    conversationId:string;
    senderId:string;
    content:string;
    type:string;
    sendAt:Date;
    isRead:boolean
}