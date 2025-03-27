import { inject,injectable } from "tsyringe";
import { IResetPasswordUseCase } from "../../entities/useCaseInterfaces/auth/IResetPasswordUseCase";
import { IRedisTokenRepository } from "../../entities/repositoryInterfaces/redis/IRedisTokenRepository";
import { IClientRepository } from "../../entities/repositoryInterfaces/client/IClient-repository.interface";
import { ERROR_MESSAGES,HTTP_STATUS,SUCCESS_MESSAGES } from "../../shared/constants";
import { ITokenService } from "../../entities/services/ITokenService";
import { IBcrypt } from "../../frameworks/security/bcrypt.interface";
import { CustomError } from "../../entities/utils/custom.error";


@injectable()
export class ResetPasswordUseCase implements IResetPasswordUseCase{
    constructor(
        @inject("IRedisClient") private redisRepository:IRedisTokenRepository,
        @inject("IPasswordBcrypt") private bcrypt:IBcrypt,
        @inject("ITokenService") private tokenService:ITokenService,
        @inject("IClientRepository") private clientRepository:IClientRepository
    ){}
async execute(newPassword: string, token: string, role: string): Promise<void> {
    const payload = this.tokenService.verifyResetToken(token);
    if(!payload || !payload.email){
        throw new CustomError(ERROR_MESSAGES.INVALID_TOKEN,HTTP_STATUS.BAD_REQUEST)
    }

    const email = payload.email;

    const user = await this.clientRepository.findByEmail(email);

    if(!user){
        throw new CustomError(
            ERROR_MESSAGES.USER_NOT_FOUND,
            HTTP_STATUS.NOT_FOUND
        )
    }

    const tokenValid = await this.redisRepository.verifyResetToken(user.id ?? "",token)

    if(!tokenValid){
        throw new CustomError(
            ERROR_MESSAGES.INVALID_TOKEN,
            HTTP_STATUS.BAD_REQUEST
        )
    }

    const passwordSame = await this.bcrypt.compare(newPassword,user.password);

    if(passwordSame){
        throw new CustomError(
            ERROR_MESSAGES.SAME_CURR_NEW_PASSWORD,
            HTTP_STATUS.BAD_REQUEST
        )
    }

    const hashedPassword = await this.bcrypt.hash(newPassword);

    await this.clientRepository.findAndUpdateByEmail(email,{password:hashedPassword});

    await this.redisRepository.deleteResetToken(user.id ?? "")
}
}