import { injectable, inject } from "tsyringe";
import { IJoinConversationUseCase } from "../../entities/useCaseInterfaces/conversation/IJoinConversationUseCase";
import { IConversationRepository } from "../../entities/repositoryInterfaces/conversation/IConversationRepository";

@injectable()
export class JoinConversationUseCase implements IJoinConversationUseCase {
    constructor(
        @inject("IConversationRepository") private _conversationRepository: IConversationRepository
    ) {}

    async execute(userId: string, conversationId: string): Promise<any> {
        const conversation = await this._conversationRepository.findOne(userId, conversationId);
        if (!conversation) {
            console.log(`Conversation ${conversationId} not found or user ${userId} unauthorized`);
            return null;
        }
        console.log(`User ${userId} authorized for conversation ${conversationId}`);
        return conversation;
    }
}