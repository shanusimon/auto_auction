import { Request,Response } from "express";


export interface INotificationController{
    getNotifcations(req:Request,res:Response):Promise<void>
    updateNotification(req:Request,res:Response):Promise<void>
}