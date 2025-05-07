import { Request,Response } from "express";


export interface IConversationController{
    getConversation(req:Request,res:Response):Promise<void>
    getAllConversations(req:Request,res:Response):Promise<void>
}