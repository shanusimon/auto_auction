import { IMessage } from "../../models/message.entity";

export interface IGetAllMessagesUseCase{
    execute(conversationId:string):Promise<IMessage[] | []>
}