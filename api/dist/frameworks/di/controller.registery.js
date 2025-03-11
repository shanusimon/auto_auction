"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.controllerRegistery = void 0;
//module imports
const tsyringe_1 = require("tsyringe");
//controller imports
const register_controller_1 = require("../../interface-adapters/controllers/auth/register.controller");
class controllerRegistery {
    static registerControllers() {
        tsyringe_1.container.register("RegisterUserController", {
            useClass: register_controller_1.RegisterUserController
        });
    }
}
exports.controllerRegistery = controllerRegistery;
