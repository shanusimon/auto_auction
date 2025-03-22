import { IRefreshTokenRepository } from "../../../entities/repositoryInterfaces/auth/IRefreshToken-RepositoryInterface";
import { RefreshTokenModel } from "../../../frameworks/database/schemas/refresh-token-schema";
import { TRole } from "../../../shared/constants";

export class RefreshTokenRepository implements IRefreshTokenRepository{
    async save(data: { token: string; userType: TRole; user: string; expiresAt: number; }): Promise<void> {
        await RefreshTokenModel.create({
            token:data.token,
            userType:data.userType,
            user:data.user,
            expiresAt:data.expiresAt
        })    
    }

    async revokeRefreshToken(token: string): Promise<void> {
        await RefreshTokenModel.deleteOne({token})
    }
}