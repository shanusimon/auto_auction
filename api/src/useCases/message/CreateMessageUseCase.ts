import { IMessage } from "../../entities/models/message.entity";
import { ICreateMessageUseCase } from "../../entities/useCaseInterfaces/message/ICreateMessageUseCase";
import { IMessageRepository } from "../../entities/repositoryInterfaces/message/IMessageRepository";
import { inject, injectable } from "tsyringe";
import { IConversationRepository } from "../../entities/repositoryInterfaces/conversation/IConversationRepository";

@injectable()
export class CreateMessageUseCase implements ICreateMessageUseCase{
    constructor(
        @inject("IMessageRepository") private messageRepository:IMessageRepository,
        @inject("IConversationRepository") private conversationRepository:IConversationRepository
    ){}
    async execute(conversationId: string, senderId: string, content: string, type: string): Promise<IMessage> {
        const message = await this.messageRepository.create(conversationId, senderId, type, content);
        await this.conversationRepository.updateLastMessage(conversationId, content, senderId);
        return message;
      }
}