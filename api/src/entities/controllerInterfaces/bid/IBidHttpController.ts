import { Request,Response } from "express"

export interface IBidHttpController{
    GetAllBids(req:Request,res:Response):Promise<void>
    getBidHistory(req:Request,res:Response):Promise<void>
}