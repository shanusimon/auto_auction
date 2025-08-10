import { inject,injectable } from "tsyringe";
import { IGenerateTokenUseCase } from "../../entities/useCaseInterfaces/auth/IGenerateTokenUseCase";
import { ITokenService } from "../../entities/services/ITokenService";
import { TRole } from "../../shared/constants";
import { IRefreshTokenRepository } from "../../entities/repositoryInterfaces/auth/IRefreshToken-RepositoryInterface";

@injectable()
export class GenerateTokenUseCase implements IGenerateTokenUseCase{
    constructor(
        @inject("ITokenService") private _tokenService:ITokenService,
        @inject("IRefreshTokenRepository") private _refreshTokenRepository:IRefreshTokenRepository
    ) {}
    async execute(id: string, email: string, role: string): Promise<{ accessToken: string; refreshToken: string; }> {
        const payload = {id,email,role};

        const accessToken = this._tokenService.generateAccessToken(payload);
        const refreshToken = this._tokenService.generateRefreshToken(payload);

        await this._refreshTokenRepository.save({
            token:refreshToken,
            userType:role as TRole,
            user:id,
            expiresAt:Date.now() + 7 * 24 * 60 * 60 * 1000
        });

        return {accessToken,refreshToken}
    }
}
