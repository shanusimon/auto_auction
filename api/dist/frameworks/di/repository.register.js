"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RepositoryRegistry = void 0;
//module import 
const tsyringe_1 = require("tsyringe");
const client_repository_1 = require("../../interface-adapters/repositories/client/client.repository");
class RepositoryRegistry {
    static registerRepositories() {
        tsyringe_1.container.register("IClientRepository", {
            useClass: client_repository_1.ClientRepository,
        });
    }
}
exports.RepositoryRegistry = RepositoryRegistry;
