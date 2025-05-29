import {container} from "tsyringe";


import { DependencyInjection } from ".";

//* ====== Controller Imports ====== *//
import { BlockStatusMiddleware } from "../../interface-adapters/middlewares/blockStatusMiddleware";

//* ====== Controller Imports ====== *//
import { AuthController } from "../../interface-adapters/controllers/auth/AuthController";
import { UserController } from "../../interface-adapters/controllers/users/UserController";
import { WalletController } from "../../interface-adapters/controllers/wallet/walletController";
import { TransactionController } from "../../interface-adapters/controllers/transaction/TransactoinController";
import { HandleWebHookController } from "../../interface-adapters/controllers/payment/HandleWebHookController";
import { SellerController } from "../../interface-adapters/controllers/seller/SellerController";
import { CarController } from "../../interface-adapters/controllers/car/CarController";
import { BidController } from "../../interface-adapters/controllers/bid/BidController";
import { CarCommentController } from "../../interface-adapters/controllers/carComments/carCommentsController";
import { ChatController } from "../../interface-adapters/controllers/chat/ChatController";
import { ConversationController } from "../../interface-adapters/controllers/conversation/ConversationController";
import { BidHttpController } from "../../interface-adapters/controllers/bid/BIdHttpController";
import { PostController } from "../../interface-adapters/controllers/post/PostController";
import { NotificationController } from "../../interface-adapters/controllers/notification/NotificationController";
import { AuctionController } from "../../interface-adapters/controllers/Auction/AuctionContorller";
import { RevenueController } from "../../interface-adapters/controllers/revenue/RevenueController";
// Registering all registries using a single class

DependencyInjection.registerAll();

//Middleware Resolving
export const blockStatusMiddleware = container.resolve(BlockStatusMiddleware);

//* ====== Controller Resolving ====== *//
export const authController = container.resolve(AuthController);
export const userController = container.resolve(UserController) 
export const walletController = container.resolve(WalletController);
export const webHookController = container.resolve(HandleWebHookController);
export const transactionController = container.resolve(TransactionController);
export const sellerController = container.resolve(SellerController);
export const carController = container.resolve(CarController)
export const bidController = container.resolve(BidController);
export const carCommentController = container.resolve(CarCommentController);
export const chatController = container.resolve(ChatController)
export const conversationController = container.resolve(ConversationController)
export const bidHttpController = container.resolve(BidHttpController)
export const postController = container.resolve(PostController)
export const notificationController = container.resolve(NotificationController);
export const auctionController = container.resolve(AuctionController)
export const revenueController = container.resolve(RevenueController)
