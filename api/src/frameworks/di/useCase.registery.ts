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
import { IGetAllCustomersUseCase } from "../../entities/useCaseInterfaces/admin/IGetallCustomersUseCase";
import { getAllCustomers } from "../../useCases/admin/GetAllUserUseCase";
import { IUpdateCustomerStatusUseCase } from "../../entities/useCaseInterfaces/admin/IUpdateCustomerStatusUseCase";
import { UpdateCustomerStatusUseCase } from "../../useCases/admin/UpdateUserStatusUseCase";
import { IGoogleAuthUseCase } from "../../entities/useCaseInterfaces/auth/IGoogleAuthUseCase";
import { GoogleAuthUseCase } from "../../useCases/auth/GoogleAuthUseCase";
import { ForgetPasswordUseCase } from "../../useCases/auth/ForgetPasswordUseCase";
import { IForgetPasswordUseCase } from "../../entities/useCaseInterfaces/auth/IForgetPasswordUseCase";
import { ResetPasswordUseCase } from "../../useCases/auth/ResetPasswordUseCase";
import { IResetPasswordUseCase } from "../../entities/useCaseInterfaces/auth/IResetPasswordUseCase";
import { IUpdateProfileUseCase } from "../../entities/useCaseInterfaces/user/IUpdateProfileUseCase";
import { UpdateProfileUseCase } from "../../useCases/user/UpdateProfileUseCase";
import { IUpdatePasswordUseCase } from "../../entities/useCaseInterfaces/user/IUpadatePasswordUseCase";
import { UpdatePasswordUseCase } from "../../useCases/user/UpdatePasswordUseCase";


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
    container.register<IGetAllCustomersUseCase>("IGetAllCustomersUseCase", {
      useClass: getAllCustomers,
    });
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
    container.register<IUpdateCustomerStatusUseCase>(
      "IUpdateCustomerStatusUseCase",
      {
        useClass: UpdateCustomerStatusUseCase,
      }
    );
    container.register<IGoogleAuthUseCase>("IGoogleAuthUseCase", {
      useClass: GoogleAuthUseCase,
    });
    container.register<IForgetPasswordUseCase>("IForgetPasswordUseCase",{
      useClass:ForgetPasswordUseCase
    })
    container.register<IResetPasswordUseCase>("IResetPasswordUseCase",{
      useClass:ResetPasswordUseCase
    })
    container.register<IUpdateProfileUseCase>("IUpdateProfileUseCase",{
      useClass:UpdateProfileUseCase
    })
    container.register<IUpdatePasswordUseCase>("IUpdatePasswordUseCase",{
      useClass:UpdatePasswordUseCase
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
