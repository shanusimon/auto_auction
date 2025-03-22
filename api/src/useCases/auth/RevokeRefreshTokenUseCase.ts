import { inject,injectable } from "tsyringe";
import { IRefreshTokenRepository } from "../../entities/repositoryInterfaces/auth/IRefreshToken-RepositoryInterface";
import { IRevokeRefreshTokenUseCase } from "../../entities/useCaseInterfaces/auth/IRevokeRefreshTokenUseCase";

@injectable()
export class RevokeRefreshTokenUseCase implements IRevokeRefreshTokenUseCase{
    constructor(
        @inject("IRefreshTokenRepository") private refreshTokenRepository:IRefreshTokenRepository
    ){}
    async execute(token: string): Promise<void> {
        await this.refreshTokenRepository.revokeRefreshToken(token)
    }
}

