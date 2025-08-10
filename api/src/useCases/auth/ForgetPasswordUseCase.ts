import { inject,injectable } from "tsyringe";
import { IForgetPasswordUseCase } from "../../entities/useCaseInterfaces/auth/IForgetPasswordUseCase";
import { ITokenService } from "../../entities/services/ITokenService";
import { IRedisTokenRepository } from "../../entities/repositoryInterfaces/redis/IRedisTokenRepository";
import { INodemailerService } from "../../entities/services/INodeMailerService";
import { IClientRepository } from "../../entities/repositoryInterfaces/client/IClient-repository.interface";
import { ERROR_MESSAGES,HTTP_STATUS } from "../../shared/constants";
import { CustomError } from "../../entities/utils/custom.error";
import { config } from "../../shared/config";


@injectable()
export class ForgetPasswordUseCase implements IForgetPasswordUseCase{
    constructor(
        @inject("ITokenService") private _tokenService:ITokenService,
        @inject("INodemailerService") private _emailService:INodemailerService,
        @inject("IClientRepository") private _clientRepository:IClientRepository,
        @inject("IRedisTokenRepository") private _redisTokenRepository:IRedisTokenRepository
    ) {}

    async execute(email: string, role: string): Promise<void> {
        const user = await this._clientRepository.findByEmail(email);
        console.log("HelloForgetPassword UseCase")
        console.log(user)
        if(!user || !user.id){
            throw new CustomError(ERROR_MESSAGES.EMAIL_NOT_FOUND,HTTP_STATUS.FORBIDDEN)
        }

        const resetToken = this._tokenService.generateResetToken(email);

        try {
            await this._redisTokenRepository.storeResetToken(user.id,resetToken)
        } catch (error) {
            console.error("Failed to store reset token in Redis");
            throw new CustomError(ERROR_MESSAGES.SERVER_ERROR,HTTP_STATUS.INTERNAL_SERVER_ERROR)
        }

        const resetURL = new URL(`/reset-password/${resetToken}`,config.cors.ALLOWED_ORGIN).toString();
        await this._emailService.sendRestEmail(email,"Auto-Auction : Reset Password Link",resetURL);
    }
}