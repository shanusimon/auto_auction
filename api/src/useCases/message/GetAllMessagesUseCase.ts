import { IMessage } from "../../entities/models/message.entity";
import { IGetAllMessagesUseCase } from "../../entities/useCaseInterfaces/message/IGetallmessagesUseCase";
import { IMessageRepository } from "../../entities/repositoryInterfaces/message/IMessageRepository";
import { inject,injectable } from "tsyringe";

@injectable()
export class GetAllMessagesUseCase implements IGetAllMessagesUseCase{
    constructor(
        @inject("IMessageRepository") private _messageRepository:IMessageRepository
    ){}
    async execute(conversationId: string): Promise<IMessage[] | []> {
        const messages = await this._messageRepository.findAllMessagesWithConversationId(conversationId);
        return messages
    }
}