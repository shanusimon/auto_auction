import { inject,injectable } from "tsyringe";
import { ITokenService } from "../../entities/services/ITokenService";
import { IRefreshTokenUseCase } from "../../entities/useCaseInterfaces/auth/IRefreshTokenUseCase";
import { HTTP_STATUS } from "../../shared/constants";
import { Jwt, JwtPayload } from "jsonwebtoken";
import { CustomError } from "../../entities/utils/custom.error";

@injectable()
export class RefreshTokenUseCase implements IRefreshTokenUseCase{
    constructor(@inject("ITokenService") private ITokenService:ITokenService){}
     execute(refreshToken: string): { role: string; accessToken: string; } {
        const payload = this.ITokenService.verifyRefreshToken(refreshToken);

        if(!payload){
            throw new CustomError("Invalid refresh token",HTTP_STATUS.BAD_REQUEST);
        }
        return{
            role:(payload as JwtPayload).role,
            accessToken:this.ITokenService.generateAccessToken({
                id:(payload as JwtPayload).id,
                email:(payload as JwtPayload).email,
                role:(payload as JwtPayload).role
            })
        }
    }
}