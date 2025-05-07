import { IMessage } from "../../models/message.entity";

export interface IMessageRepository{
    findAllMessagesWithConversationId(conversationId:string):Promise<IMessage[] | []>
    create(conversaionId:string,senderId:string,type:string,content:string):Promise<IMessage>
}