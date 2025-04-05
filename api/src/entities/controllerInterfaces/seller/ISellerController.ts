import { Request,Response } from "express";

export interface ISellerController {
    register(req:Request,res:Response):Promise<void>
}