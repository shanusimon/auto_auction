import { IConversation } from "../../models/conversation.entity";

export interface IGetAllConversationUseCase{
    execute(userId:string):Promise<IConversation[]>
}