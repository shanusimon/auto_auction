"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerController = void 0;
const tsyringe_1 = require("tsyringe");
const _1 = require(".");
//* ====== Controller Imports ====== *//
const register_controller_1 = require("../../interface-adapters/controllers/auth/register.controller");
// Registering all registries using a single class
_1.DependencyInjection.registerAll();
//* ====== Controller Resolving ====== *//
exports.registerController = tsyringe_1.container.resolve(register_controller_1.RegisterUserController);
