import { JwtPayload } from "jsonwebtoken";
import { IRedisTokenRepository } from "../../entities/repositoryInterfaces/redis/IRedisTokenRepository";
import { IBlackListTokenUseCase } from "../../entities/repositoryInterfaces/auth/IBlackListTokenUseCase";
import { ITokenService } from "../../entities/services/ITokenService";
import { inject,injectable } from "tsyringe";

@injectable()
export class BlackListTokenUseCase  implements IBlackListTokenUseCase{
    constructor(
        @inject("IRedisTokenRepository") private redisTokenRepository:IRedisTokenRepository,
        @inject("ITokenService") private tokenService:ITokenService
    ){}
    async execute(token: string): Promise<void> {
        const decoded:string |JwtPayload | null = this.tokenService.verifyAccessToken(token);

        if(!decoded || typeof decoded === "string" || !decoded.exp){
            throw new Error("Invalid Token Missing Expiration Time");
        }

        const expiresIn = decoded.exp - Math.floor(Date.now() / 1000);
        if(expiresIn > 0){
            await this.redisTokenRepository.blackListToken(token,expiresIn)
        }
    }

}