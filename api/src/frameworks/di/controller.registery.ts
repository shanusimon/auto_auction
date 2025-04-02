//module imports
import { container } from "tsyringe";

//middleware imports
import { BlockStatusMiddleware } from "../../interface-adapters/middlewares/blockStatusMiddleware";

//controller imports
import { AuthController } from "../../interface-adapters/controllers/auth/AuthController";
import { UserController } from "../../interface-adapters/controllers/users/UserController";
import { WalletController } from "../../interface-adapters/controllers/wallet/walletController";
import { HandleWebHookController } from "../../interface-adapters/controllers/payment/HandleWebHookController";
import { TransactionController } from "../../interface-adapters/controllers/transaction/TransactoinController";

export class controllerRegistery{
    static registerControllers():void{
        container.register("BlockStatusMiddleware",{
            useClass:BlockStatusMiddleware
        })
        container.register("AuthContorller",{
            useClass:AuthController
        })
        container.register("CustomerController",{
            useClass:UserController
        })
        container.register("WalletController",{
            useClass:WalletController
        })
        container.register("HandleWebHookController",{
            useClass:HandleWebHookController
        })
        container.register("TransactionController",{
            useClass:TransactionController
        })
    }
}