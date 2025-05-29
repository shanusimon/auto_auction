import { Request, Response } from "express";

export interface IAuctionController{
    endAuction(req:Request,res:Response):Promise<void>;
    getWonAuction(req:Request,res:Response):Promise<void>
    createCheckOutSession(req:Request,res:Response):Promise<void>
    verifyPayment(req:Request,res:Response):Promise<void>
}
