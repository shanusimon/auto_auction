import { inject,injectable } from "tsyringe";
import { IOtpService } from "../../../entities/services/IOtpService";
import { IBcrypt } from "../../../frameworks/security/bcrypt.interface";
import { IGenerateOtpUseCase } from "../../../entities/useCaseInterfaces/auth/IGenerateOtpUseCase";
import { INodemailerService } from "../../../entities/services/INodeMailerService";

@injectable()
export class GenerateOtpUseCase implements IGenerateOtpUseCase{
    constructor(
        @inject("IOtpService") private _otpService:IOtpService,
        @inject("IPasswordBcrypt") private _bcryptService:IBcrypt,
        @inject("INodemailerService") private _mailService:INodemailerService
    ){}

    async execute(email: string): Promise<void> {
        try {
       
        const otp = await this._otpService.generateOtp();
        console.log("otp is",otp);
        const hashedOtp = await this._bcryptService.hash(otp);
        
        console.log(hashedOtp)
        
        await this._otpService.storeOtp(email,hashedOtp);

        const storedOtp = await this._otpService.getOtp(email);
            
        console.log(storedOtp);

        await this._mailService.sendOtpEmail(email,otp)
        } catch (error) {
            console.log("error in usecase")
            console.log(error)
        }

    }

}