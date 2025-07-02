import { IConversation } from "../../entities/models/conversation.entity";
import { IGetConversationUseCase } from "../../entities/useCaseInterfaces/conversation/IGetConversationUseCase";
import { ISellerRepository } from "../../entities/repositoryInterfaces/seller/ISellerRepository";
import { inject, injectable } from "tsyringe";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../shared/constants";
import { IConversationRepository } from "../../entities/repositoryInterfaces/conversation/IConversationRepository";


@injectable()
export class GetConversationUseCase implements IGetConversationUseCase{
    constructor(
        @inject("ISellerRepository") private sellerRepository:ISellerRepository,
        @inject("IConversationRepository") private conversationRepository:IConversationRepository
    ){}
    async execute(userId: string, sellerId: string): Promise<IConversation> {
        const seller = await this.sellerRepository.findOne(sellerId);
        if(!seller){
            throw new Error(
                ERROR_MESSAGES.SELLER_NOT_FOUND,
            )
        }

        const existingConversation = await this.conversationRepository.findConversation(userId,String(seller.userId));
        if(existingConversation){
            return existingConversation
        }
        const newConversation = await this.conversationRepository.createConversation({
            user1Id: userId,
            user2Id: String(seller.userId)
        });

        return newConversation
    
    }
}