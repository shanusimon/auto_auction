import { IConversation } from "../../entities/models/conversation.entity";
import { IGetAllConversationUseCase } from "../../entities/useCaseInterfaces/conversation/IGetAllConversationsUseCase";
import { IConversationRepository } from "../../entities/repositoryInterfaces/conversation/IConversationRepository";
import { inject,injectable } from "tsyringe";

@injectable()
export class GetAllConversationUseCase implements IGetAllConversationUseCase{
    constructor(
        @inject("IConversationRepository") private conversationRepository:IConversationRepository
    ){}
    async execute(userId: string): Promise<IConversation[]> {
        const conversations = await this.conversationRepository.findAllConversations(userId);
        return conversations
    }
}