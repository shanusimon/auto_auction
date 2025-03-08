"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRoutes = void 0;
const base_route_1 = require("../base.route");
class AuthRoutes extends base_route_1.BaseRoute {
    constructor() {
        super();
    }
    initializeRoutes() {
        this.router.post("/signup", (req, res) => {
            console.log(req.body);
            res.send("Signup router called");
        });
    }
}
exports.AuthRoutes = AuthRoutes;
