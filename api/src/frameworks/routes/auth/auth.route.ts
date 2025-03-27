import { Request, Response } from "express";
import { BaseRoute } from "../base.route";
import { authController } from "../../di/resolver";

export class AuthRoutes extends BaseRoute {
  constructor() {
    super();
  }
  protected initializeRoutes(): void {
    this.router.post("/signup", (req: Request, res: Response) => {
      authController.register(req, res);
    });
    this.router.post("/send-otp", (req, res) => {
      authController.sendOtpEmail(req, res);
    });
    this.router.post("/verify-otp", (req: Request, res: Response) => {
      authController.verifyOtp(req, res);
    });
    this.router.post("/verify-login", (req, res) => {
      authController.login(req, res);
    });
    this.router.post("/google-auth",(req:Request,res:Response)=>{
      authController.googleAuth(req,res)
    })
    this.router.post("/forget-password",(req:Request,res:Response)=>{
      authController.forgetPassword(req,res)
    })
    this.router.post("/reset-password",(req:Request,res:Response)=>{
      authController.resetPassword(req,res);
    })
  }
}