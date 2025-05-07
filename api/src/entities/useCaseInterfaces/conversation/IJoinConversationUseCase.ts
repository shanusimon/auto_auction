import { IConversation } from "../../models/conversation.entity";

export interface IJoinConversationUseCase {
    execute(userId:string,conversaionId:string):Promise<IConversation | null>
}