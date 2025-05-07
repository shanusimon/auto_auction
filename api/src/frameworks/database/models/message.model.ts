import { IMessage } from "../../../entities/models/message.entity";
import { model, ObjectId } from "mongoose";
import { MessageSchema } from "../schemas/message.schema";

export interface IMessageModel extends Omit<IMessage,"id" | "conversationId" | "senderId">,Document{
    _id:ObjectId,
    conversationId:ObjectId,
    senderId:ObjectId
}

export const MessageModel = model<IMessageModel>("Message",MessageSchema)