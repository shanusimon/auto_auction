import { container } from "tsyringe";

//bcrypt imports
import { IBcrypt } from "../security/bcrypt.interface";
import { PasswordBcrypt } from "../security/password.bcrypt";

//strategy Imports
import { ClientRegisterStrategy } from "../../useCases/auth/register-strategies/Client-register.strategy";
import { ClientLoginStrategy } from "../../useCases/auth/login-strategies/ClientLoginStrategy";
import { AdminLoginStrategy } from "../../useCases/auth/login-strategies/AdminLoginStrategy";

//UseCase Imports
import { IRegisterUserUseCase } from "../../entities/useCaseInterfaces/auth/IRegister-usecase.interface";
import { RegisterUserUseCase } from "../../useCases/auth/register-user-usecase";
import { IGenerateOtpUseCase } from "../../entities/useCaseInterfaces/auth/IGenerateOtpUseCase";
import { GenerateOtpUseCase } from "../../useCases/auth/register-strategies/GenerateOtpUseCase";
import { IVerifyOtpUseCase } from "../../entities/useCaseInterfaces/auth/IVerifyOtpUseCase";
import { VerifyOtpUseCase } from "../../useCases/auth/register-strategies/VerifyOtp.useCase";
import { GenerateTokenUseCase } from "../../useCases/auth/GenerateTokenUseCase";
import { LoginUserUseCase } from "../../useCases/auth/LoginUserUseCase";
import { IGenerateTokenUseCase } from "../../entities/useCaseInterfaces/auth/IGenerateTokenUseCase";
import { ILoginUserUseCase } from "../../entities/useCaseInterfaces/auth/ILoginUserUseCase";
import { IBlackListTokenUseCase } from "../../entities/repositoryInterfaces/auth/IBlackListTokenUseCase";
import { BlackListTokenUseCase } from "../../useCases/auth/BlackListTokenUseCase";
import { IRevokeRefreshTokenUseCase } from "../../entities/useCaseInterfaces/auth/IRevokeRefreshTokenUseCase";
import { RevokeRefreshTokenUseCase } from "../../useCases/auth/RevokeRefreshTokenUseCase";
import { IRefreshTokenUseCase } from "../../entities/useCaseInterfaces/auth/IRefreshTokenUseCase";
import { RefreshTokenUseCase } from "../../useCases/auth/RefreshTokenUseCase";
import { IGetAllCustomersUseCase } from "../../entities/useCaseInterfaces/customers/IGetallCustomersUseCase";
import { getAllCustomers } from "../../useCases/users/GetAllUserUseCase";
import { IUpdateCustomerStatusUseCase } from "../../entities/useCaseInterfaces/customers/IUpdateCustomerStatusUseCase";
import { UpdateCustomerStatusUseCase } from "../../useCases/users/UpdateUserStatusUseCase";

export class UseCaseRegistery {
  static registerUseCases(): void {
    //* ====== Register Bcrypts ====== *//
    container.register<IBcrypt>("IPasswordBcrypt", {
      useClass: PasswordBcrypt,
    });
    //* ====== Register UseCases ====== *//
    container.register<IRegisterUserUseCase>("IRegisterUserUseCase", {
      useClass: RegisterUserUseCase,
    });
    container.register<IGetAllCustomersUseCase>("IGetAllCustomersUseCase",{
      useClass:getAllCustomers
    })
    container.register<IGenerateOtpUseCase>("IGenerateOtpUseCase", {
      useClass: GenerateOtpUseCase,
    });
    container.register<IVerifyOtpUseCase>("IVerifyOtpUseCase", {
      useClass: VerifyOtpUseCase,
    });
    container.register<IGenerateTokenUseCase>("IGenerateTokenUseCase", {
      useClass: GenerateTokenUseCase,
    });
    container.register<ILoginUserUseCase>("ILoginUserUseCase", {
      useClass: LoginUserUseCase,
    });
    container.register<IBlackListTokenUseCase>("IBlackListTokenUseCase", {
      useClass: BlackListTokenUseCase,
    });
    container.register<IRevokeRefreshTokenUseCase>(
      "IRevokeRefreshTokenUseCase",
      {
        useClass: RevokeRefreshTokenUseCase,
      }
    );
    container.register<IRefreshTokenUseCase>("IRefreshTokenUseCase", {
      useClass: RefreshTokenUseCase,
    });
    container.register<IUpdateCustomerStatusUseCase>("IUpdateCustomerStatusUseCase",{
      useClass:UpdateCustomerStatusUseCase
    })
    //* ====== Register Strategy ====== *//
    container.register("ClientRegisterStrategy", {
      useClass: ClientRegisterStrategy,
    });
    container.register("ClientLoginStrategy", {
      useClass: ClientLoginStrategy,
    });
    container.register("AdminLoginStrategy", {
      useClass: AdminLoginStrategy,
    });
  }
}
