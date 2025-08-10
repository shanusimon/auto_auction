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
import { IRevokeFCMTokenUseCase } from "../../../entities/useCaseInterfaces/auth/IRevokeFCMTokenUseCase";


@injectable()
export class AuthController implements IAuthController {
  constructor(
    @inject("ILoginUserUseCase") 
    private _loginUserUseCase: ILoginUserUseCase,
    @inject("IGenerateTokenUseCase")
    private _generateTokenUseCase: IGenerateTokenUseCase,
    @inject("IRegisterUserUseCase")
    private _registerUserUseCase: IRegisterUserUseCase,
    @inject("IBlackListTokenUseCase")
    private _blacklistTokenUseCase: IBlackListTokenUseCase,
    @inject("IRevokeRefreshTokenUseCase")
    private _revokeRefreshTokenUseCase: IRevokeRefreshTokenUseCase,
    @inject("IUserExistenceService")
    private _userExistenceService: IUserExistenceService,
    @inject("IGenerateOtpUseCase")
    private _generateOtpUseCase: IGenerateOtpUseCase,
    @inject("IVerifyOtpUseCase") 
    private _verifyOtpUseCase: IVerifyOtpUseCase,
    @inject("IRefreshTokenUseCase")
    private _refreshTokenUseCase: IRefreshTokenUseCase,
    @inject("IGoogleAuthUseCase")
    private _googleAuthUseCase:IGoogleAuthUseCase,
    @inject("IForgetPasswordUseCase")
    private _forgetPasswordUseCase:IForgetPasswordUseCase,
    @inject("IResetPasswordUseCase")
    private _resetPasswordUseCase:IResetPasswordUseCase,
    @inject("IRevokeFCMTokenUseCase")
    private _revokeFCMtokenUseCase:IRevokeFCMTokenUseCase
  ) {}

  //*                  🛠️ User Login

  async login(req: Request, res: Response): Promise<void> {
    try {
      console.log("Hello World")
      const data = req.body as LoginUserDTO;
      const validatedData = loginSchema.parse(data);
      console.log("THis is validated data",validatedData);
      const user = await this._loginUserUseCase.execute(validatedData);

      if (!user.id || !user.email || !user.role) {
        throw new Error("User ID,Email, or role is missing");
      }

      const tokens = await this._generateTokenUseCase.execute(
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
          id:user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone:user.phone,
          profileImage:user.profileImage,
          bio:user.bio,
          isSeller:user.isSeller,
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
      await this._registerUserUseCase.execute(vaildateData);
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
      
      const user = (req as CustomRequest).user;

      if (user.role === "user") {
        try {
          await this._revokeFCMtokenUseCase.execute(user.id); 
        } catch (err) {
          console.warn(`Failed to revoke FCM token for user ${user.id}:`, err);
        }
      }

      await this._blacklistTokenUseCase.execute(
        (req as CustomRequest).user.access_token
      );


      await this._revokeRefreshTokenUseCase.execute(
        (req as CustomRequest).user.refresh_token
      );

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
      const userExists = await this._userExistenceService.emailExists(email);
      if (userExists) {
        res
          .status(HTTP_STATUS.UNAUTHORIZED)
          .json({ message: ERROR_MESSAGES.EMAIL_EXISTS });
        return;
      }

      await this._generateOtpUseCase.execute(email);

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
      await this._verifyOtpUseCase.execute(validatedDate);

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
      const newTokens = this._refreshTokenUseCase.execute(refreshToken);
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
        
        const user = await this._googleAuthUseCase.execute(credential,client_id,role);

        if(!user.id || !user.email || !user.role){
          throw new Error("User ID,email,or role is missing");
        }

        const tokens = await this._generateTokenUseCase.execute(
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
            id:user.id,
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
        await this._forgetPasswordUseCase.execute(validatedDate.email,validatedDate.role);

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

        await this._resetPasswordUseCase.execute(newPassword,token,role);
        res.status(HTTP_STATUS.OK).json({
          success:true,
          message:SUCCESS_MESSAGES.PASSWORD_RESET_SUCCESS
        })
      } catch (error) {
       handleErrorResponse(res,error) 
      }
   }
}
