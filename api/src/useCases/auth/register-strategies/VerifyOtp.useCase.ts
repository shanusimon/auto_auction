import { inject,injectable } from "tsyringe";
import { IVerifyOtpUseCase } from "../../../entities/useCaseInterfaces/auth/IVerifyOtpUseCase";
import { IOtpService } from "../../../entities/services/IOtpService";
import { CustomError } from "../../../entities/utils/custom.error";
import { HTTP_STATUS } from "../../../shared/constants";


@injectable()
export class VerifyOtpUseCase implements IVerifyOtpUseCase{
    constructor(
        @inject("IOtpService") private _otpService:IOtpService
    ){}
    async execute({ email, otp }: { email: string; otp: string; }): Promise<void> {
        const isOtpValid = await this._otpService.verifyOtp(email,otp);
        console.log("si Valid OTP",isOtpValid)

        if(!isOtpValid)
            throw new CustomError("Invalid OTP",HTTP_STATUS.BAD_REQUEST);

    }
}