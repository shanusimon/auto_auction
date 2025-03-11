//module imports
import { container } from "tsyringe";

//controller imports
import { RegisterUserController } from "../../interface-adapters/controllers/auth/register.controller";
import { SendOtpEmailContoller } from "../../interface-adapters/controllers/auth/SendOtpController";
import { VerifyOtpController } from "../../interface-adapters/controllers/auth/verifyOtpController";


export class controllerRegistery{
    static registerControllers():void{
        container.register("RegisterUserController",{
            useClass:RegisterUserController
        })

        container.register("SendOtpEmailController",{
            useClass:SendOtpEmailContoller
        })
        container.register("VerifyOtpController",{
            useClass:VerifyOtpController
        })
    }
}