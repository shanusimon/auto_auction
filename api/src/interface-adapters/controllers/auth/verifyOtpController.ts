import  { Request,Response } from "express";
import { inject,injectable } from "tsyringe";
import { IVerifyOtpController } from "../../../entities/controllerInterfaces/auth/IVerifyOtpController";
import { otpMailValidationSchema } from "../validations/otp-mail.validation.schema";
import { ERROR_MESSAGES,HTTP_STATUS,SUCCESS_MESSAGES } from "../../../shared/constants";
import { ZodError } from "zod";
import { CustomError } from "../../../entities/utils/custom.error";
import { IVerifyOtpUseCase } from "../../../entities/useCaseInterfaces/auth/IVerifyOtpUseCase";

@injectable()
export class VerifyOtpController implements IVerifyOtpController{
    constructor(
        @inject("IVerifyOtpUseCase") private verifyOtpUseCase :IVerifyOtpUseCase
    ){}

    async handle(req: Request, res: Response): Promise<void> {
        try {
            const {email,otp} = req.body;
            const validatedDate = otpMailValidationSchema.parse({email,otp});
            await this.verifyOtpUseCase.execute(validatedDate);

            res.status(HTTP_STATUS.OK).json({
                success:true,
                message:SUCCESS_MESSAGES.VERIFICATION_SUCCESS
            })
        } catch (error) {
            if(error instanceof ZodError){
                console.log("Error here ")
                const errors = error.errors.map((err)=>({
                    message:err.message
                }))

                res.status(HTTP_STATUS.BAD_REQUEST).json({
                    success:false,
                    message:ERROR_MESSAGES.VALIDATION_ERROR,
                    errors
                })
                return
            }
            if (error instanceof CustomError) {
				res.status(error.statusCode).json({
					success: false,
					message: error.message,
				});
				return;
			}
            console.log("Error at Verify-otp-controller", error);
			res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
				success: false,
				message: ERROR_MESSAGES.SERVER_ERROR,
			});
        }
    }
}