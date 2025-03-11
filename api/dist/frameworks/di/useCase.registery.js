"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UseCaseRegistery = void 0;
const tsyringe_1 = require("tsyringe");
const password_bcrypt_1 = require("../security/password.bcrypt");
//strategy Imports
const client_register_strategy_1 = require("../../useCases/auth/register-strategies/client-register.strategy");
const register_user_usecase_1 = require("../../useCases/auth/register-user-usecase");
class UseCaseRegistery {
    static registerUseCases() {
        //* ====== Register UseCases ====== *//
        tsyringe_1.container.register("IRegisterUserUseCase", {
            useClass: register_user_usecase_1.RegisterUserUseCase
        });
        //* ====== Register Bcrypts ====== *//
        tsyringe_1.container.register("PasswordBcrypt", {
            useClass: password_bcrypt_1.PasswordBcrypt,
        });
        //* ====== Register Strategy ====== *//
        tsyringe_1.container.register("ClientRegisterStrategy", {
            useClass: client_register_strategy_1.ClientRegisterStrategy
        });
    }
}
exports.UseCaseRegistery = UseCaseRegistery;
