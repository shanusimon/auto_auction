import { AdminRoutes } from "../admin/AdminRoutes";
import { BaseRoute } from "../base.route";
import { PaymentRoutes } from "../payment/PaymentRoutes";

import { ClientRoutes } from "../user/client.route";

export class PrivateRoutes extends BaseRoute{
    constructor(){
        super();
    }
    protected initializeRoutes(): void {
        this.router.use("/_us",new ClientRoutes().router);
        this.router.use("/_ad",new AdminRoutes().router)
        this.router.use("/_pmt",new PaymentRoutes().router)
    }
}