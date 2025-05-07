import { Request,Response } from "express";

export interface ISellerController {
    register(req:Request,res:Response):Promise<void>
    getAllSellerRequest(req:Request,res:Response):Promise<void>
    updateSellerStatus(req:Request,res:Response):Promise<void>
    getSellerDetails(req:Request,res:Response):Promise<void>
    getAllApprovedSellers(req:Request,res:Response):Promise<void>
    updateSellerActiveStatus(req:Request,res:Response):Promise<void>;
    getSellerStatistics(req:Request,res:Response):Promise<void>
}