import { IMessage } from "../../models/message.entity";

export interface ICreateMessageUseCase {
    execute(conversaionId:string,senderId:string,content:string,type:string):Promise<IMessage>
}