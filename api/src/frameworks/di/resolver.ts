import {container} from "tsyringe";


import { DependencyInjection } from ".";

//* ====== Controller Imports ====== *//
import { BlockStatusMiddleware } from "../../interface-adapters/middlewares/blockStatusMiddleware";

//* ====== Controller Imports ====== *//
import { AuthController } from "../../interface-adapters/controllers/auth/AuthController";
import { CustomerController } from "../../interface-adapters/controllers/CustomerController";
// Registering all registries using a single class

DependencyInjection.registerAll();

//Middleware Resolving
export const blockStatusMiddleware = container.resolve(BlockStatusMiddleware);

//* ====== Controller Resolving ====== *//
export const authController = container.resolve(AuthController);
export const customerController = container.resolve(CustomerController) 
