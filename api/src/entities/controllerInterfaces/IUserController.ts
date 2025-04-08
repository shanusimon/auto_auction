import { Request,Response,NextFunction } from "express";

export interface IUserController {
    getAllCustomers(req:Request,res:Response,next:NextFunction):Promise<void>;
    updateCustomerStatus(req:Request,res:Response,next:NextFunction):Promise<void>;
    updateCustomerProfile(req:Request,res:Response,next:NextFunction):Promise<void>;
    updateCustomerPassword(req:Request,res:Response,next:NextFunction):Promise<void>;
    isSeller(req:Request,res:Response,next:NextFunction):Promise<void>;
    saveFcmToken(req:Request,res:Response):Promise<void>;
}