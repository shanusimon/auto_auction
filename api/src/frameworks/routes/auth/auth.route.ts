import { Request,Response } from "express";
import { BaseRoute } from "../base.route";
import { OtpVerifyController, registerController,SendOtpController } from "../../di/resolver";

export class AuthRoutes extends BaseRoute{
    constructor(){
        super();
    }

    protected initializeRoutes(): void {
        this.router.post("/signup",(req:Request,res:Response)=>{
            registerController.handle(req,res);
        })
       this.router.post('/send-otp',(req,res)=>{
        SendOtpController.handle(req,res);
       })
       this.router.post('/verify-otp',(req:Request,res:Response)=>{
        OtpVerifyController.handle(req,res);
       })
    }
}