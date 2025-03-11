"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRoutes = void 0;
const base_route_1 = require("../base.route");
const resolver_1 = require("../../di/resolver");
class AuthRoutes extends base_route_1.BaseRoute {
    constructor() {
        super();
    }
    initializeRoutes() {
        this.router.post("/signup", (req, res) => {
            resolver_1.registerController.handle(req, res);
        });
        this.router.get("/home", (req, res) => {
            res.send("Hello Auto Auction");
        });
    }
}
exports.AuthRoutes = AuthRoutes;
