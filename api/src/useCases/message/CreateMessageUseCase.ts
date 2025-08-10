import { IMessage } from "../../entities/models/message.entity";
import { ICreateMessageUseCase } from "../../entities/useCaseInterfaces/message/ICreateMessageUseCase";
import { IMessageRepository } from "../../entities/repositoryInterfaces/message/IMessageRepository";
import { inject, injectable } from "tsyringe";
import { IConversationRepository } from "../../entities/repositoryInterfaces/conversation/IConversationRepository";

@injectable()
export class CreateMessageUseCase implements ICreateMessageUseCase{
    constructor(
        @inject("IMessageRepository") private _messageRepository:IMessageRepository,
        @inject("IConversationRepository") private _conversationRepository:IConversationRepository
    ){}
    async execute(conversationId: string, senderId: string, content: string, type: string,imageUrl?:string): Promise<IMessage> {
        const message = await this._messageRepository.create(conversationId, senderId, type, content,imageUrl);
        await this._conversationRepository.updateLastMessage(conversationId, content, senderId);
        return message;
      }
}