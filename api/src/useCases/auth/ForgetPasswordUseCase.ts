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
        @inject("ITokenService") private tokenService:ITokenService,
        @inject("INodemailerService") private emailService:INodemailerService,
        @inject("IClientRepository") private clientRepository:IClientRepository,
        @inject("IRedisTokenRepository") private redisTokenRepository:IRedisTokenRepository
    ) {}

    async execute(email: string, role: string): Promise<void> {
        const user = await this.clientRepository.findByEmail(email);
        if(!user || !user.id){
            throw new CustomError(ERROR_MESSAGES.EMAIL_NOT_FOUND,HTTP_STATUS.FORBIDDEN)
        }

        const resetToken = this.tokenService.generateResetToken(email);

        try {
            await this.redisTokenRepository.storeResetToken(user.id,resetToken)
        } catch (error) {
            console.error("Failed to store reset token in Redis");
            throw new CustomError(ERROR_MESSAGES.SERVER_ERROR,HTTP_STATUS.INTERNAL_SERVER_ERROR)
        }

        const resetURL = new URL(`/reset-password/${resetToken}`,config.cors.ALLOWED_ORGIN).toString();
        await this.emailService.sendRestEmail(email,"Auto-Auction : Reset Password Link",resetURL);
    }
}