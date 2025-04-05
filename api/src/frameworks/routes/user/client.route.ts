import { NextFunction, Request, RequestHandler, Response } from "express";
import {
  authorizeRole,
  decodeToken,
  verifyAuth,
  
} from "../../../interface-adapters/middlewares/authMiddleware";

import { authController, transactionController, userController, walletController,sellerController } from "../../di/resolver";
import { BaseRoute } from "../base.route";
import { blockStatusMiddleware } from "../../di/resolver";


export class ClientRoutes extends BaseRoute {
  constructor() {
    super();
  }
  protected initializeRoutes(): void {

    //logout
    this.router.post(
      "/user/logout",
      verifyAuth,
      authorizeRole(["user"]),
      blockStatusMiddleware.checkStatus as RequestHandler,
      (req: Request, res: Response) => {
        console.log("Hello LogOut");
        authController.logout(req,res);
      }
    );

    //profile-edit
    this.router.patch(
      "/user/edit-profile",
      verifyAuth,
      authorizeRole(["user"]),
      blockStatusMiddleware.checkStatus as RequestHandler,
      (req:Request,res:Response)=>{
        userController.updateCustomerProfile(req,res);
      }
    )

    //User password change 
    this.router.patch(
      "/user/change-password",
      verifyAuth,
      authorizeRole(["user"]),
      blockStatusMiddleware.checkStatus as RequestHandler,
      (req:Request,res:Response)=>{
        userController.updateCustomerPassword(req,res);
      }
    );

    //Wallet Balance
    this.router.get(
      "/user/getWalletBalance",
      verifyAuth,
      authorizeRole(["user"]),
      blockStatusMiddleware.checkStatus as RequestHandler,
      (req:Request,res:Response)=>{
        walletController.getWalletBalance(req,res);
      }
    )

    //seller status
    this.router.get(
      "/user/seller-status",
      verifyAuth,
      authorizeRole(["user"]),
      blockStatusMiddleware.checkStatus as RequestHandler,
      (req:Request,res:Response,next:NextFunction)=>{
        userController.isSeller(req,res,next);
      }
    )

    //transaction history
    this.router.get(
      "/user/getAllTransaction",
      verifyAuth,
      authorizeRole(["user"]),
      blockStatusMiddleware.checkStatus as RequestHandler,
      (req:Request,res:Response)=>{
        transactionController.getAllTransaction(req,res);
      }
    )

    //seller Request
    this.router.post(
      "/user/seller-request",
      verifyAuth,
      authorizeRole(["user"]),
      blockStatusMiddleware.checkStatus as RequestHandler,
      (req:Request,res:Response)=>{
        sellerController.register(req,res);
      }
    )
    
    //token refresh
    this.router.post(
      "/user/refresh-token",
      decodeToken,
      (req:Request,res:Response)=>{
        console.log("refresh Token triggered");
        authController.refreshToken(req,res);
      }
    )
  }
}
