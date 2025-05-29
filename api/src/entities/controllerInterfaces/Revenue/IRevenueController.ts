import { Request,Response } from "express"

export interface IRevenueController{
    getChartData(req:Request,res:Response):Promise<void>
    getAdminDashboard(req:Request,res:Response):Promise<void>;
}