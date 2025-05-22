import { IMessage } from "../../../entities/models/message.entity";
import { IMessageRepository } from "../../../entities/repositoryInterfaces/message/IMessageRepository";
import { MessageModel } from "../../../frameworks/database/models/message.model";

export class MessageRepository implements IMessageRepository{
    constructor(){}
    async findAllMessagesWithConversationId(conversationId: string): Promise<IMessage[]> {
        const messages = await MessageModel.find({ conversationId }).lean();
        return messages.map((msg) => this.mapToEntity(msg));
    }    
    async create(conversationId: string, senderId: string, type: string, content: string,imageUrl?:string): Promise<IMessage> {
        const message = await MessageModel.create({
            conversationId,
            senderId,
            content,
            type,
            imageUrl:imageUrl || null,
            sendAt:new Date(),
            isRead:false
        })
        return this.mapToEntity(message)
    }
    private mapToEntity(message: any): IMessage {
        return {
            id: message._id.toString(),
            conversationId: message.conversationId.toString(),
            senderId: message.senderId.toString(),
            content: message.content,
            type:message.type,
            imageUrl: message.imageUrl || null,
            sendAt: message.sendAt,
            isRead: message.isRead,
        };
    }
    
    
}