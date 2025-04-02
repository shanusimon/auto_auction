import { inject, injectable } from "tsyringe";

import { IAuthController } from "../../../entities/controllerInterfaces/auth/IAuthController";

import { Request, Response } from "express";

import {
  ERROR_MESSAGES,
  HTTP_STATUS,
  SUCCESS_MESSAGES,
} from "../../../shared/constants";
import { LoginUserDTO } from "../../../shared/dtos/user.dto";
import { UserDTO } from "../../../shared/dtos/user.dto";

import { handleErrorResponse } from "../../../shared/utils/errorHandler";

import {
  setAuthCookies,
  clearAuthCookies,
  updateCookieWithAccessToken,
} from "../../../shared/utils/cookieHelper";

import { otpMailValidationSchema } from "../validations/otp-mail.validation.schema";
import {
  userSignupSchemas,
  loginSchema,
} from "../validations/user-signup.validation.schema";
import { forgotEmailValidationSchema } from "../validations/forgot-password.validation.schema";

import { CustomRequest } from "../../middlewares/authMiddleware";

import { IRegisterUserUseCase } from "../../../entities/useCaseInterfaces/auth/IRegister-usecase.interface";
import { ILoginUserUseCase } from "../../../entities/useCaseInterfaces/auth/ILoginUserUseCase";
import { IGenerateTokenUseCase } from "../../../entities/useCaseInterfaces/auth/IGenerateTokenUseCase";
import { IBlackListTokenUseCase } from "../../../entities/repositoryInterfaces/auth/IBlackListTokenUseCase";
import { IRevokeRefreshTokenUseCase } from "../../../entities/useCaseInterfaces/auth/IRevokeRefreshTokenUseCase";
import { IUserExistenceService } from "../../../entities/services/Iuser-existence-service.interface";
import { IGenerateOtpUseCase } from "../../../entities/useCaseInterfaces/auth/IGenerateOtpUseCase";
import { IVerifyOtpUseCase } from "../../../entities/useCaseInterfaces/auth/IVerifyOtpUseCase";
import { IRefreshTokenUseCase } from "../../../entities/useCaseInterfaces/auth/IRefreshTokenUseCase";
import { IGoogleAuthUseCase } from "../../../entities/useCaseInterfaces/auth/IGoogleAuthUseCase";
import { IForgetPasswordUseCase } from "../../../entities/useCaseInterfaces/auth/IForgetPasswordUseCase";
import { resetPasswordValidationSchema } from "../validations/reset-password.validation.schema";
import { IResetPasswordUseCase } from "../../../entities/useCaseInterfaces/auth/IResetPasswordUseCase";

@injectable()
export class AuthController implements IAuthController {
  constructor(
    @inject("ILoginUserUseCase") 
    private loginUserUseCase: ILoginUserUseCase,
    @inject("IGenerateTokenUseCase")
    private generateTokenUseCase: IGenerateTokenUseCase,
    @inject("IRegisterUserUseCase")
    private registerUserUseCase: IRegisterUserUseCase,
    @inject("IBlackListTokenUseCase")
    private blacklistTokenUseCase: IBlackListTokenUseCase,
    @inject("IRevokeRefreshTokenUseCase")
    private revokeRefreshTokenUseCase: IRevokeRefreshTokenUseCase,
    @inject("IUserExistenceService")
    private userExistenceService: IUserExistenceService,
    @inject("IGenerateOtpUseCase")
    private generateOtpUseCase: IGenerateOtpUseCase,
    @inject("IVerifyOtpUseCase") 
    private verifyOtpUseCase: IVerifyOtpUseCase,
    @inject("IRefreshTokenUseCase")
    private refreshTokenUseCase: IRefreshTokenUseCase,
    @inject("IGoogleAuthUseCase")
    private googleAuthUseCase:IGoogleAuthUseCase,
    @inject("IForgetPasswordUseCase")
    private forgetPasswordUseCase:IForgetPasswordUseCase,
    @inject("IResetPasswordUseCase")
    private resetPasswordUseCase:IResetPasswordUseCase
  ) {}

  //*                  🛠️ User Login

  async login(req: Request, res: Response): Promise<void> {
    try {
      console.log("Hello World")
      const data = req.body as LoginUserDTO;
      const validatedData = loginSchema.parse(data);
      console.log("THis is validated data",validatedData);
      const user = await this.loginUserUseCase.execute(validatedData);

      if (!user.id || !user.email || !user.role) {
        throw new Error("User ID,Email, or role is missing");
      }

      const tokens = await this.generateTokenUseCase.execute(
        user.id,
        user.email,
        user.role
      );

      const accessTokenName = `${user.role}_access_token`;
      const refreshTokenName = `${user.role}_refresh_token`;

      setAuthCookies(
        res,
        tokens.accessToken,
        tokens.refreshToken,
        accessTokenName,
        refreshTokenName
      );
      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: SUCCESS_MESSAGES.LOGIN_SUCCESS,
        user: {
          name: user.name,
          email: user.email,
          role: user.role,
          phone:user.phone,
          profileImage:user.profileImage,
          bio:user.bio,
          joinedAt:user.joinedAt
        },
      });
    } catch (error) {
      handleErrorResponse(res, error);
    }
  }

  //*                  🛠️ User Register

  async register(req: Request, res: Response): Promise<void> {
    try {
      const { role } = req.body as UserDTO;
      const schema = userSignupSchemas[role];
      if (!schema) {
        res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: ERROR_MESSAGES.INVALID_CREDENTIALS,
        });
        return;
      }
      console.log("before validate", req.body);
      const vaildateData = schema.parse(req.body);
      console.log("validate", vaildateData);
      await this.registerUserUseCase.execute(vaildateData);
      res.status(HTTP_STATUS.CREATED).json({
        success: true,
        message: SUCCESS_MESSAGES.REGISTRATION_SUCCESS,
      });
    } catch (error) {
      handleErrorResponse(res, error);
    }
  }
  //*                  🛠️ User Logout

  async logout(req: Request, res: Response): Promise<void> {
    try {
      await this.blacklistTokenUseCase.execute(
        (req as CustomRequest).user.access_token
      );

      await this.revokeRefreshTokenUseCase.execute(
        (req as CustomRequest).user.refresh_token
      );

      const user = (req as CustomRequest).user;
      console.log("logout user", user);
      const accessTokenName = `${user.role}_access_token`;
      const refreshTokenName = `${user.role}_refresh_token`;

      clearAuthCookies(res, accessTokenName, refreshTokenName);
      res
        .status(HTTP_STATUS.OK)
        .json({ success: true, message: SUCCESS_MESSAGES.LOGOUT_SUCCESS });
    } catch (error) {
      handleErrorResponse(res, error);
    }
  }

  //*                  🛠️ User SendOtpEmail

  async sendOtpEmail(req: Request, res: Response): Promise<void> {
    const { email } = req.body;
    try {
      const userExists = await this.userExistenceService.emailExists(email);
      if (userExists) {
        res
          .status(HTTP_STATUS.UNAUTHORIZED)
          .json({ message: ERROR_MESSAGES.EMAIL_EXISTS });
        return;
      }

      await this.generateOtpUseCase.execute(email);

      res
        .status(HTTP_STATUS.CREATED)
        .json({ message: SUCCESS_MESSAGES.OTP_SEND_SUCCESS });
    } catch (error) {
      handleErrorResponse(res, error);
    }
  }

  //*                  🛠️ User VerifyOtp

  async verifyOtp(req: Request, res: Response): Promise<void> {
    try {
      const { email, otp } = req.body;
      const validatedDate = otpMailValidationSchema.parse({ email, otp });
      await this.verifyOtpUseCase.execute(validatedDate);

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: SUCCESS_MESSAGES.VERIFICATION_SUCCESS,
      });
    } catch (error) {
      handleErrorResponse(res, error);
    }
  }

   //*                  🛠️ Regenerate Refresh Token
  
  refreshToken(req: Request, res: Response): void {
    try {
      const refreshToken = (req as CustomRequest).user.refresh_token;
      const newTokens = this.refreshTokenUseCase.execute(refreshToken);
      const accessTokenName = `${newTokens.role}_access_token`;
      updateCookieWithAccessToken(res, newTokens.accessToken, accessTokenName);
      res
        .status(HTTP_STATUS.OK)
        .json({ success: true, message: SUCCESS_MESSAGES.OPERATION_SUCCESS });
    } catch (error) {
      clearAuthCookies(
        res,
        `${(req as CustomRequest).user.role}_access_token`,
        `${(req as CustomRequest).user.role}_refresh_token`
      );
      res
        .status(HTTP_STATUS.UNAUTHORIZED)
        .json({ message: ERROR_MESSAGES.INVALID_TOKEN });
    }
  }

   //*                  🛠️ Google Auth 

   async googleAuth(req: Request, res: Response): Promise<void> {
       try {
        const {credential,client_id,role} = req.body;
        console.log("hello google data",req.body)
        const user = await this.googleAuthUseCase.execute(credential,client_id,role);

        if(!user.id || !user.email || !user.role){
          throw new Error("User ID,email,or role is missing");
        }

        const tokens = await this.generateTokenUseCase.execute(
          user.id,
          user.email,
          user.role
        );

        const access_token_name = `${user.role}_access_token`;
        const refresh_token_name = `${user.role}_refresh_token`;

        setAuthCookies(
          res,
          tokens.accessToken,
          tokens.refreshToken,
          access_token_name,
          refresh_token_name
        )
        console.log(user);
        res.status(HTTP_STATUS.OK).json({
          success:true,
          message:SUCCESS_MESSAGES.LOGIN_SUCCESS,
          user: {
            name: user.name,
            email: user.email,
            role: user.role,
            phone:user.phone,
            profileImage:user.profileImage,
            bio:user.bio,
            joinedAt:user.joinedAt
          }
        })

       } catch (error) {
        handleErrorResponse(res,error)
       }
   }

      //*                  🛠️ Forget Password 

   async forgetPassword(req: Request, res: Response): Promise<void> {
       try {
        const values = req.body;

        const validatedDate = forgotEmailValidationSchema.parse(values);
        console.log("THis is validte Data",validatedDate)
        await this.forgetPasswordUseCase.execute(validatedDate.email,validatedDate.role);

        res.status(HTTP_STATUS.OK).json({
          success:true,
          message:SUCCESS_MESSAGES.RESETMAIL_SEND_SUCCESS
        })
       } catch (error) {
        handleErrorResponse(res,error)
       }
   }

      //*                  🛠️ Reset Password 

   async resetPassword(req: Request, res: Response): Promise<void> {
      try {
        const {newPassword,token,role} = resetPasswordValidationSchema.parse(req.body);

        await this.resetPasswordUseCase.execute(newPassword,token,role);
        res.status(HTTP_STATUS.OK).json({
          success:true,
          message:SUCCESS_MESSAGES.PASSWORD_RESET_SUCCESS
        })
      } catch (error) {
       handleErrorResponse(res,error) 
      }
   }
}
