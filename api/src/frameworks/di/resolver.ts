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
// Registering all registries using a single class

DependencyInjection.registerAll();

//Middleware Resolving
export const blockStatusMiddleware = container.resolve(BlockStatusMiddleware);

//* ====== Controller Resolving ====== *//
export const authController = container.resolve(AuthController);
export const userController = container.resolve(UserController) 
export const walletController = container.resolve(WalletController)
export const webHookController = container.resolve(HandleWebHookController)
export const transactionController = container.resolve(TransactionController);