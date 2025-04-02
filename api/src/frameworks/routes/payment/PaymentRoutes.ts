import { BaseRoute } from "../base.route";
import { Request, Response,NextFunction, RequestHandler } from "express";
import { blockStatusMiddleware, walletController, webHookController } from "../../di/resolver";
import { authorizeRole, verifyAuth } from "../../../interface-adapters/middlewares/authMiddleware";


export class PaymentRoutes extends BaseRoute {
  constructor() {
    super();
    this.initializeRoutes()
  }
  protected initializeRoutes(): void {
      this.router.post("/user/add-money",
        verifyAuth,
        authorizeRole(["user"]),
        blockStatusMiddleware.checkStatus as RequestHandler,
        (req:Request,res:Response)=>{
          walletController.addMoneyToWallet(req,res)
        }
      )
      this.router.post("/client/webhook",(req:Request,res:Response)=>{
        webHookController.handle(req,res);
      })
  }
}