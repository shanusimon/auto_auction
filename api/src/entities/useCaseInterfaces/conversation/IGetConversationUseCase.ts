import { IConversation } from "../../models/conversation.entity";

export interface IGetConversationUseCase{
    execute(userId:string,sellerId:string):Promise<IConversation>
}