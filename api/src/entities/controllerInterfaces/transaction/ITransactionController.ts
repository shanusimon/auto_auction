import { Request,Response } from "express"

export interface ITransactionController {
    getAllTransaction(req:Request,res:Response):Promise<void>
}