//* ====== Registry Imports ====== *//
import { controllerRegistery } from "./controller.registery";
import { RepositoryRegistry } from "./repository.register";
import { UseCaseRegistery } from "./useCase.registery";

//Register all registries using single class 

export class DependencyInjection{
    static registerAll():void{
        UseCaseRegistery.registerUseCases();
        RepositoryRegistry.registerRepositories();
        controllerRegistery.registerControllers();
    }
}