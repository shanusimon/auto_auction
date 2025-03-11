import { container } from "tsyringe";

//bcrypt imports
import { IBcrypt } from "../security/bcrypt.interface";
import { PasswordBcrypt } from "../security/password.bcrypt";

//strategy Imports
import { ClientRegisterStrategy } from "../../useCases/auth/register-strategies/client-register.strategy";

//UseCase Imports
import { IRegisterUserUseCase } from "../../entities/useCaseInterfaces/auth/register-usecase.interface";
import { RegisterUserUseCase } from "../../useCases/auth/register-user-usecase";
import { IGenerateOtpUseCase } from "../../entities/useCaseInterfaces/auth/IGenerateOtpUseCase";
import { GenerateOtpUseCase } from "../../useCases/auth/register-strategies/GenerateOtpUseCase";
import { IVerifyOtpUseCase } from "../../entities/useCaseInterfaces/auth/IVerifyOtpUseCase";
import { VerifyOtpUseCase } from "../../useCases/auth/register-strategies/verifyOtp.useCase";

export class UseCaseRegistery{
  
    static registerUseCases():void{
        //* ====== Register UseCases ====== *//
        container.register<IRegisterUserUseCase>("IRegisterUserUseCase",{
            useClass:RegisterUserUseCase
        })
        //* ====== Register Bcrypts ====== *//
        container.register<IBcrypt>("IPasswordBcrypt",{
            useClass:PasswordBcrypt,
        })
        //* ====== Register Strategy ====== *//
        container.register("ClientRegisterStrategy",{
            useClass:ClientRegisterStrategy
        })
        container.register<IGenerateOtpUseCase>("IGenerateOtpUseCase",{
            useClass:GenerateOtpUseCase
        })
        container.register<IVerifyOtpUseCase>("IVerifyOtpUseCase",{
            useClass:VerifyOtpUseCase
        })
    }
}