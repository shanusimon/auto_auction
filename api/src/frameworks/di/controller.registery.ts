//module imports
import { container } from "tsyringe";

//middleware imports
import { BlockStatusMiddleware } from "../../interface-adapters/middlewares/blockStatusMiddleware";

//controller imports
import { AuthController } from "../../interface-adapters/controllers/auth/AuthController";
import { CustomerController } from "../../interface-adapters/controllers/CustomerController";

export class controllerRegistery{
    static registerControllers():void{
        container.register("BlockStatusMiddleware",{
            useClass:BlockStatusMiddleware
        })
        container.register("AuthContorller",{
            useClass:AuthController
        })
        container.register("CustomerController",{
            useClass:CustomerController
        })
    }
}