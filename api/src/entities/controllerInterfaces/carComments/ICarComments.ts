import { Request,Response } from "express";

export interface ICarCommentController{
    create(req:Request,res:Response):Promise<void>
    getCarCommentsAndBids(req:Request,res:Response):Promise<void>
}