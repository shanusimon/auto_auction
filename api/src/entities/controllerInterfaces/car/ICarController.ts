import { Request,Response } from "express";

export interface ICarController {
    register(req:Request,res:Response):Promise<void>
    getAllCars(req:Request,res:Response):Promise<void>
    updateCarStatus(req:Request,res:Response):Promise<void>;
    getCarsWithFilter(req:Request,res:Response):Promise<void>;
    getCarDetails(req:Request,res:Response):Promise<void>
    getSoldCars(req:Request,res:Response):Promise<void>
}