import {
  authorizeRole,
  decodeToken,
  verifyAuth,
} from "../../../interface-adapters/middlewares/authMiddleware";
import { authController, userController } from "../../di/resolver";
import { BaseRoute } from "../base.route";
import { Request, Response, NextFunction } from "express";

export class AdminRoutes extends BaseRoute {
  constructor() {
    super();
  }
  protected initializeRoutes(): void {
    this.router.post(
      "/admin/logout",
      verifyAuth,
      authorizeRole(["admin"]),
      (req: Request, res: Response) => {
        authController.logout(req, res);
      }
    );
    this.router.get(
      "/admin/get-allusers",
      verifyAuth,
      authorizeRole(["admin"]),
      (req: Request, res: Response) => {
        userController.getAllCustomers(req, res);
      }
    );
    this.router.patch(
      "/admin/customer-status/:userId",
      verifyAuth,
      authorizeRole(["admin"]),
      (req: Request, res: Response) => {
        userController.updateCustomerStatus(req, res);
      }
    );
    this.router.post(
      "/admin/refresh-token",
      decodeToken,
      (req:Request,res:Response)=>{
        authController.refreshToken(req,res)
      }
    )
  }
}
