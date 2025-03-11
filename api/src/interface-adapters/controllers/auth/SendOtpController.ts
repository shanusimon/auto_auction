import { Request,Response } from "express";
import { inject,injectable } from "tsyringe";
import { IUserExistenceService } from "../../../entities/services/Iuser-existence-service.interface";
import { IGenerateOtpUseCase } from "../../../entities/useCaseInterfaces/auth/IGenerateOtpUseCase";
import { ISendOtpEmailController } from "../../../entities/controllerInterfaces/auth/send-otp-email.interface";
import { HTTP_STATUS,SUCCESS_MESSAGES,ERROR_MESSAGES } from "../../../shared/constants";


@injectable()
export class SendOtpEmailContoller implements ISendOtpEmailController{
    constructor(
        @inject("IUserExistenceService") private userExistenceService:IUserExistenceService,
        @inject("IGenerateOtpUseCase") private generateOtpUseCase:IGenerateOtpUseCase
    ){}

    async handle(req: Request, res: Response): Promise<void> {
        const {email} = req.body;

        try {
            const userExists = await this.userExistenceService.emailExists(email);
            if(userExists){
                res.status(HTTP_STATUS.UNAUTHORIZED).json({message:ERROR_MESSAGES.EMAIL_EXISTS})
                return
            }

            await this.generateOtpUseCase.execute(email);

            res.status(HTTP_STATUS.CREATED).json({message:SUCCESS_MESSAGES.OTP_SEND_SUCCESS})

        } catch (error) {
            console.log("Error in controller of OTP send")
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({message:ERROR_MESSAGES.SERVER_ERROR})
        }
    }
}