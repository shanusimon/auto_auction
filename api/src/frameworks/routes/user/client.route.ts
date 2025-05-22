import { NextFunction, Request, RequestHandler, Response } from "express";
import {
  authorizeRole,
  decodeToken,
  verifyAuth,
} from "../../../interface-adapters/middlewares/authMiddleware";

import {
  authController,
  transactionController,
  userController,
  walletController,
  sellerController,
  carController,
  carCommentController,
  conversationController,
  bidHttpController,
  postController,
  notificationController,
} from "../../di/resolver";

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
        authController.logout(req, res);
      }
    );

    //profile-edit
    this.router.patch(
      "/user/edit-profile",
      verifyAuth,
      authorizeRole(["user"]),
      blockStatusMiddleware.checkStatus as RequestHandler,
      (req: Request, res: Response) => {
        userController.updateCustomerProfile(req, res);
      }
    );

    //saving fcm token
    this.router.post(
      "/user/savefcm-token",
      verifyAuth,
      authorizeRole(["user"]),
      blockStatusMiddleware.checkStatus as RequestHandler,
      (req: Request, res: Response) => {
        userController.saveFcmToken(req, res);
      }
    );
  
    this.router.get(
      "/user/bids",
      verifyAuth,
      authorizeRole(["user"]),
      blockStatusMiddleware.checkStatus as RequestHandler,
      (req: Request, res: Response) => {
        bidHttpController.GetAllBids(req, res);
      }
    );

    //User password change
    this.router.patch(
      "/user/change-password",
      verifyAuth,
      authorizeRole(["user"]),
      blockStatusMiddleware.checkStatus as RequestHandler,
      (req: Request, res: Response) => {
        userController.updateCustomerPassword(req, res);
      }
    );

    //Wallet Balance
    this.router.get(
      "/user/getWalletBalance",
      verifyAuth,
      authorizeRole(["user"]),
      blockStatusMiddleware.checkStatus as RequestHandler,
      (req: Request, res: Response) => {
        walletController.getWalletBalance(req, res);
      }
    );

    //seller status
    this.router.get(
      "/user/seller-status",
      verifyAuth,
      authorizeRole(["user"]),
      blockStatusMiddleware.checkStatus as RequestHandler,
      (req: Request, res: Response, next: NextFunction) => {
        userController.isSeller(req, res);
      }
    );

    this.router.get(
      "/user/cars",
      verifyAuth,
      authorizeRole(["user"]),
      blockStatusMiddleware.checkStatus as RequestHandler,
      (req: Request, res: Response) => {
        carController.getCarsWithFilter(req, res);
      }
    );
    //transaction history
    this.router.get(
      "/user/getAllTransaction",
      verifyAuth,
      authorizeRole(["user"]),
      blockStatusMiddleware.checkStatus as RequestHandler,
      (req: Request, res: Response) => {
        transactionController.getAllTransaction(req, res);
      }
    );

    //get cars in home page
    this.router.post(
      "/user/register-car",
      verifyAuth,
      authorizeRole(["user"]),
      blockStatusMiddleware.checkStatus as RequestHandler,
      (req: Request, res: Response) => {
        carController.register(req, res);
      }
    );

    //seller Request
    this.router.post(
      "/user/seller-request",
      verifyAuth,
      authorizeRole(["user"]),
      blockStatusMiddleware.checkStatus as RequestHandler,
      (req: Request, res: Response) => {
        sellerController.register(req, res);
      }
    );

    //car-details
    this.router.get(
      "/user/car/:id",
      verifyAuth,
      authorizeRole(["user"]),
      blockStatusMiddleware.checkStatus as RequestHandler,
      (req: Request, res: Response) => {
        carController.getCarDetails(req, res);
      }
    );

    
    this.router.post(
      "/user/conversation",
      verifyAuth,
      authorizeRole(["user"]),
      blockStatusMiddleware.checkStatus as RequestHandler,
      (req: Request, res: Response) => {
        conversationController.getConversation(req, res);
      }
    );

    //post car comment
    this.router.post(
      "/user/car-comment",
      verifyAuth,
      authorizeRole(["user"]),
      blockStatusMiddleware.checkStatus as RequestHandler,
      (req: Request, res: Response) => {
        carCommentController.create(req, res);
      }
    );
    
    //to get car comments
    this.router.get(
      "/user/car-comments/:carid",
      verifyAuth,
      authorizeRole(["user"]),
      blockStatusMiddleware.checkStatus as RequestHandler,
      (req: Request, res: Response) => {
        carCommentController.getCarCommentsAndBids(req, res);
      }
    );

    //token refresh
    this.router.post(
      "/user/refresh-token",
      decodeToken,
      (req: Request, res: Response) => {
        console.log("refresh Token triggered");
        authController.refreshToken(req, res);
      }
    );

    //get bid history
    this.router.get(
      "/user/bid-history/:carId",
      verifyAuth,
      authorizeRole(["user"]),
      blockStatusMiddleware.checkStatus as RequestHandler,
      (req: Request, res: Response) => {
        bidHttpController.getBidHistory(req, res);
      }
    );

    //create post
    this.router.post(
      "/user/create-post",
      verifyAuth,
      authorizeRole(["user"]),
      blockStatusMiddleware.checkStatus as RequestHandler,
      (req: Request, res: Response) => {
        postController.createPost(req, res);
      }
    );

    //get community posts 
    this.router.get(
      "/user/posts",
      verifyAuth,
      authorizeRole(["user"]),
      blockStatusMiddleware.checkStatus as RequestHandler,
      (req:Request,res:Response)=>{
        postController.getAllPost(req,res);
      }
    )

    this.router.patch(
      '/user/like/:postId',
      verifyAuth,
      authorizeRole(["user"]),
      blockStatusMiddleware.checkStatus as RequestHandler,
      (req:Request,res:Response)=>{
        postController.addLike(req,res);
      }
    )

    // get all notification 
    this.router.get(
      '/user/notification',
      verifyAuth,
      authorizeRole(['user']),
      blockStatusMiddleware.checkStatus as RequestHandler,
      (req:Request,res:Response)=>{
        notificationController.getNotifcations(req,res)
      }
    )

    // mark notification as read
     this.router.patch(
      "/user/notification",
      verifyAuth,
      authorizeRole(["user"]),
      blockStatusMiddleware.checkStatus as RequestHandler,
      (req:Request,res:Response)=>{
        notificationController.updateNotification(req,res);
      }
     )

    //seller-status
    this.router.get(
      "/user/seller-statistics",
      verifyAuth,
      authorizeRole(["user"]),
      blockStatusMiddleware.checkStatus as RequestHandler,
      (req: Request, res: Response) => {
        sellerController.getSellerStatistics(req, res);
      }
    );

  }
}
