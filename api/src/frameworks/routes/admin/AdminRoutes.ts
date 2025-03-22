import {
  authorizeRole,
  verifyAuth,
} from "../../../interface-adapters/middlewares/authMiddleware";
import { authController, customerController } from "../../di/resolver";
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
      (req: Request, res: Response, next: NextFunction) => {
        customerController.getAllCustomers(req, res, next);
      }
    );
    this.router.patch(
      "/admin/customer-status/:userId",
      verifyAuth,
      authorizeRole(["admin"]),
      (req: Request, res: Response, next: NextFunction) => {
        customerController.updateCustomerStatus(req, res, next);
      }
    );
  }
}
