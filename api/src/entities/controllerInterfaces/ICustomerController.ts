import { Request,Response,NextFunction } from "express";

export interface ICustomerController {
    getAllCustomers(req:Request,res:Response,next:NextFunction):Promise<void>;
    updateCustomerStatus(req:Request,res:Response,next:NextFunction):Promise<void>;
}