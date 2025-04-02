import { NextFunction, Request,Response } from "express";

export interface IWalletController {
    addMoneyToWallet(req:Request,res:Response,next:NextFunction):Promise<void>
    getWalletBalance(req:Request,res:Response):Promise<void>
}