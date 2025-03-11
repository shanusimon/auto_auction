import {container} from "tsyringe";


import { DependencyInjection } from ".";

//* ====== Controller Imports ====== *//
import { RegisterUserController } from "../../interface-adapters/controllers/auth/register.controller";
import { SendOtpEmailContoller } from "../../interface-adapters/controllers/auth/SendOtpController";
import { VerifyOtpController } from "../../interface-adapters/controllers/auth/verifyOtpController";
// Registering all registries using a single class
DependencyInjection.registerAll();


//* ====== Controller Resolving ====== *//
export const registerController = container.resolve(RegisterUserController);
export const SendOtpController = container.resolve(SendOtpEmailContoller);
export const OtpVerifyController = container.resolve(VerifyOtpController)