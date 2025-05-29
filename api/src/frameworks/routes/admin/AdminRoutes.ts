import {
  authorizeRole,
  decodeToken,
  verifyAuth,
} from "../../../interface-adapters/middlewares/authMiddleware";
import { authController, sellerController, userController,carController, revenueController } from "../../di/resolver";
import { BaseRoute } from "../base.route";
import { Request, Response } from "express";

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
    this.router.get(
      "/admin/seller",
      verifyAuth,
      authorizeRole(["admin"]),
      (req:Request,res:Response)=>{
        sellerController.getAllApprovedSellers(req,res)
      }
    )
    this.router.get(
      "/admin/get-allSellerRequests",
      verifyAuth,
      authorizeRole(["admin"]),
      (req:Request,res:Response)=>{
        sellerController.getAllSellerRequest(req,res);
      }
    )
    this.router.get(
      "/admin/get-allCarRequests",
      verifyAuth,
      authorizeRole(["admin"]),
      (req:Request,res:Response)=>{
        carController.getAllCars(req,res)
      }
    )
    this.router.get(
      "/admin/seller-details/:sellerId",
      verifyAuth,
      authorizeRole(["admin"]),
      (req:Request,res:Response)=>{
        sellerController.getSellerDetails(req,res);
      }
    )
    this.router.patch(
      "/admin/customer-status/:userId",
      verifyAuth,
      authorizeRole(["admin"]),
      (req: Request, res: Response) => {
        userController.updateCustomerStatus(req, res);
      }
    )
    this.router.post(
      "/admin/refresh-token",
      decodeToken,
      (req:Request,res:Response)=>{
        authController.refreshToken(req,res)
      }
    )
    this.router.patch(
      "/admin/seller-status/:sellerId",
      verifyAuth,
      authorizeRole(["admin"]),
      (req:Request,res:Response)=>{
        sellerController.updateSellerActiveStatus(req,res);
      }
    )
    this.router.patch(
       "/admin/sellerRequest-update/:userId",
       verifyAuth,
       authorizeRole(["admin"]),
       (req:Request,res:Response)=>{
        sellerController.updateSellerStatus(req,res)
       }
    )
    this.router.patch(
      "/admin/updateCarStatus/:carId",
      verifyAuth,
      authorizeRole(["admin"]),
      (req:Request,res:Response)=>{
        carController.updateCarStatus(req,res);
      }
    )
    this.router.get(
      "/admin/revenue",
      verifyAuth,
      authorizeRole(["admin"]),
      (req:Request,res:Response)=>{
        revenueController.getChartData(req,res)
      }
    )
    this.router.get(
      '/admin/dashboard',
      verifyAuth,
      authorizeRole(["admin"]),
      (req:Request,res:Response)=>{
        revenueController.getAdminDashboard(req,res);
      }
    )
  }
}
