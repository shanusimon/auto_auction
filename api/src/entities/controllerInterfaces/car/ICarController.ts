import { Request,Response } from "express";

export interface ICarController {
    register(req:Request,res:Response):Promise<void>
    getAllCars(req:Request,res:Response):Promise<void>
}