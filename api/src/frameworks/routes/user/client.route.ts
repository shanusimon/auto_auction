import { Request, RequestHandler, Response } from "express";
import {
  authorizeRole,
  decodeToken,
  verifyAuth,
  
} from "../../../interface-adapters/middlewares/authMiddleware";

import { authController } from "../../di/resolver";
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
