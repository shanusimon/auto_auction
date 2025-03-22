import { AdminRoutes } from "../admin/AdminRoutes";
import { BaseRoute } from "../base.route";

import { ClientRoutes } from "../user/client.route";

export class PrivateRoutes extends BaseRoute{
    constructor(){
        super();
    }
    protected initializeRoutes(): void {
        this.router.use("/_us",new ClientRoutes().router);
        this.router.use("/_ad",new AdminRoutes().router)
    }
}