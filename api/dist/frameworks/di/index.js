"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DependencyInjection = void 0;
//* ====== Registry Imports ====== *//
const controller_registery_1 = require("./controller.registery");
const repository_register_1 = require("./repository.register");
const useCase_registery_1 = require("./useCase.registery");
//Register all registries using single class 
class DependencyInjection {
    static registerAll() {
        useCase_registery_1.UseCaseRegistery.registerUseCases();
        repository_register_1.RepositoryRegistry.registerRepositories();
        controller_registery_1.controllerRegistery.registerControllers();
    }
}
exports.DependencyInjection = DependencyInjection;
