//module imports
import { container } from "tsyringe";

//middleware imports
import { BlockStatusMiddleware } from "../../interface-adapters/middlewares/blockStatusMiddleware";

//controller imports
import { AuthController } from "../../interface-adapters/controllers/auth/AuthController";
import { UserController } from "../../interface-adapters/controllers/users/UserController";
import { WalletController } from "../../interface-adapters/controllers/wallet/walletController";
import { HandleWebHookController } from "../../interface-adapters/controllers/payment/HandleWebHookController";
import { SellerController } from "../../interface-adapters/controllers/seller/SellerController";
import { TransactionController } from "../../interface-adapters/controllers/transaction/TransactoinController";
import { CarController } from "../../interface-adapters/controllers/car/CarController";
import { BidController } from "../../interface-adapters/controllers/bid/BidController";
import { CarCommentController } from "../../interface-adapters/controllers/carComments/carCommentsController";
import { ChatController } from "../../interface-adapters/controllers/chat/ChatController";
import { BidHttpController } from "../../interface-adapters/controllers/bid/BIdHttpController";

export class controllerRegistery{
    static registerControllers():void{
        container.register("BlockStatusMiddleware",{
            useClass:BlockStatusMiddleware
        })
        container.register("BidHttpController",{
            useClass:BidHttpController
        })
        container.register("BidController",{
            useClass:BidController
        })
        container.register("SellerController",{
            useClass:SellerController
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
        container.register("CarController",{
            useClass:CarController
        })
        container.register("CarCommentController",{
            useClass:CarCommentController
        })
        container.register("ChatController",{
            useClass:ChatController
        })
    }
}